var Parser = nodejsexports["binary-parser"].Parser;
var Buffer = nodejsexports["Buffer"];

/**
function readBigUInt64LE(offset) {
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
        throw new Error('Out of bounds');
    }

    const lo = first +
        this[++offset] * 2 ** 8 +
        this[++offset] * 2 ** 16 +
        this[++offset] * 2 ** 24;

    const hi = this[++offset] +
        this[++offset] * 2 ** 8 +
        this[++offset] * 2 ** 16 +
        last * 2 ** 24;

    return BigInt(lo) + (BigInt(hi) << 32n);
}
if (!Buffer.prototype.readBigUInt64LE) {  Buffer.prototype.readBigUInt64LE = readBigUInt64LE; }


function readBigUInt64BE(offset = 0) {

    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined){
        throw new Error('Out of bounds');
    }

    const hi = first * 2 ** 24 +
        this[++offset] * 2 ** 16 +
        this[++offset] * 2 ** 8 +
        this[++offset];

    const lo = this[++offset] * 2 ** 24 +
        this[++offset] * 2 ** 16 +
        this[++offset] * 2 ** 8 +
        last;

    return (BigInt(hi) << 32n) + BigInt(lo);
}
if (!Buffer.prototype.readBigUInt64BE) {  Buffer.prototype.readBigUInt64BE = readBigUInt64BE; }
**/

function toJNXTimestamp(){

    var dtInt = this;
  //  console.log(parseInt(dtInt/1000000n));
    var dt = new Date(parseInt(dtInt/1000000n));
    //console.log(dt);
    var  formatted_time = dt.getUTCHours()+':'+ _.padStart(dt.getUTCMinutes(),2,"0") +":" + _.padStart(dt.getUTCSeconds(),2,"0")+"."+ dt.getUTCMilliseconds()+ " T " +dtInt%1000000n + "";
   return ( dtInt)+ '('+formatted_time+')';
  //return '000wei'
}
//if (!Buffer.prototype.toJNXTimestamp) {  Buffer.prototype.toJNXTimestamp = toJNXTimestamp; }
if (!BigInt.prototype.toJNXTimestamp) {  BigInt.prototype.toJNXTimestamp = toJNXTimestamp; }


function annotateOUCHOMsg(ouchMsgObj){
    jnx_fields_meta_data;
    return _.transform(ouchMsgObj, function(result, value, key) {
      //  console.log(jnx_fields_meta_data)
        var description = _.get(jnx_fields_meta_data,[key,'validValues',value].join('.'));

      //  var annotatedvalue =  _.has ( jnx_fields_meta_data,[key,'validValues',value].join('.')) ?
        //     value + ['(', _.get(jnx_fields_meta_data, 'key.'+value, "None"), ')'].join('') : value ;
       result[key]= _.isEmpty(description) ? value :  [value, ' (',description , ')'].join('') ;
    }, {});

    }



function parseOUCHBuffer(e){
    var PacketType = e.slice(2,3).toString();

    //  console.log('PacketType='+PacketType);
    // console.log(MsgType);

    switch (PacketType) {

        case "U" : {
            var MsgType = e.slice(3,4).toString();
            /// console.log('MsgType='+MsgType);
            switch (MsgType) {
                case "O" : return JNX_OUCH_EnterOrder.parse(e);break;
                case "U" : return JNX_OUCH_ReplaceOrder.parse(e);break;
                case "X" : return JNX_OUCH_CancelOrder.parse(e);break;

                default  : return {};
            }
        }
            break;

        case "S" : {
            var MsgType = e.slice(3,4).toString();
            //	 console.log('MsgType='+MsgType);
            switch (MsgType) {

                case "S" : return JNX_OUCH_SystemEvent.parse(e);break;
                case "A" : return JNX_OUCH_OrderAccepted.parse(e);break;
                case "U" : return JNX_OUCH_OrderReplaced.parse(e);break;
                case "C" : return JNX_OUCH_OrderCanceled.parse(e);break;
                case "D" : return JNX_OUCH_OrderAIQCanceled.parse(e);break;
                case "E" : return JNX_OUCH_OrderExecuted.parse(e);break;
                case "J" : return JNX_OUCH_OrderRejected.parse(e);break;
                default  : return {};
            }
        }

            break;


        case "L":  return SoupBin_LoginRequest.parse(e);break;
        case "A":  return SoupBin_LoginAccepted.parse(e);break;
        case "J":  return SoupBin_LoginReject.parse(e);break;
        case "O":  return SoupBin_LogoutRequest.parse(e);break;
        case "H":  return SoupBin_ServerHeartbeat.parse(e);break;
        case "R":  return SoupBin_ClientHeartbeat.parse(e);break;
        case "Z":  return SoupBin_EndOfSession.parse(e); break;
        case "+":  return SoupBin_Debug.parse(e); break;


        default:return {};

    }

}



const JNX_OUCH_EnterOrder = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ("MessageType", {encoding: 'utf-8',length: 1})
    .uint32be("OrderToken")
    .string  ("ClientReference", {encoding: 'utf-8',length: 10})
    .string  ("BuySellIndicator",{encoding: 'utf-8',length: 1})
    .uint32be("Quantity")
    .uint32be("OrderbookId")
    .string  ("Group",{encoding: 'utf-8',length: 4})
    .uint32be("Price")
    .uint32be("TimeinForce")
    .uint32be("FirmId")
    .string  ("Display", {encoding: 'utf-8',length: 1})
    .string  ("Capacity",{encoding: 'utf-8',length: 1})
    .uint32be("MinimumQuantity")
    .string  ("OrderClassification", {encoding: 'utf-8',length: 1})
    .string  ("CashMarginType", {encoding: 'utf-8',length: 1})

const JNX_OUCH_ReplaceOrder = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ("MessageType", {encoding: 'utf-8',length: 1})
    .uint32be("ExistingOrderToken")
    .uint32be ("ReplacementOrderToken")
    .uint32be("Quantity")
    .uint32be("Price")
    .uint32be("TimeinForce")
    .string("Display",{encoding: 'utf-8',length: 1})
    .uint32be("MinimumQuantity")

const JNX_OUCH_CancelOrder = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ("MessageType", {encoding: 'utf-8',length: 1})
    .uint32be("OrderToken")
    .uint32be("Quantity")


const JNX_OUCH_SystemEvent= new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ("MessageType", {encoding: 'utf-8',length: 1})

    //.buffer('Timestamp', {length:8, formatter: (buf)=> { return buf.toJNXTimestamp() }})
    .uint64be('Timestamp', {formatter: (n)=>{ return n.toJNXTimestamp()}})

    .string  ("SystemEvent", {encoding: 'utf-8',length: 1})

const JNX_OUCH_OrderAccepted = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ("MessageType", {encoding: 'utf-8',length: 1})

    //.buffer('Timestamp', {length:8, formatter: (buf)=> { return buf.toJNXTimestamp() }})
    .uint64be('Timestamp', {formatter: (n)=>{ return n.toJNXTimestamp()}})

    .uint32be("OrderToken")
    .string  ("ClientReference", {encoding: 'utf-8',length: 10})
    .string  ("BuySellIndicator",{encoding: 'utf-8',length: 1})
    .uint32be("Quantity")
    .uint32be("OrderbookId")
    .string  ("Group",{encoding: 'utf-8',length: 4})
    .uint32be("Price")
    .uint32be("TimeinForce")
    .uint32be("FirmId")
    .string  ("Display", {encoding: 'utf-8',length: 1})
    .string  ("Capacity",{encoding: 'utf-8',length: 1})
 //   .buffer('OrderNumber', {length:8, formatter: (buf)=> { return buf.readBigUInt64BE() }})
    .uint64be('OrderNumber')
    .uint32be("MinimumQuantity")
    .string  ("OrderState",{encoding: 'utf-8',length: 1})
    .string  ("OrderClassification", {encoding: 'utf-8',length: 1})
    .string  ("CashMarginType", {encoding: 'utf-8',length: 1})



const JNX_OUCH_OrderReplaced  = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ("MessageType", {encoding: 'utf-8',length: 1})
    //.buffer('Timestamp', {length:8, formatter: (buf)=> { return buf.toJNXTimestamp() }})
    .uint64be('Timestamp', {formatter: (n)=>{ return n.toJNXTimestamp()}})

    .uint32be ("ReplacementOrderToken")
    .string  ("BuySellIndicator",{encoding: 'utf-8',length: 1})
    .uint32be("Quantity")
    .uint32be("OrderbookId")
    .string  ("Group",{encoding: 'utf-8',length: 4})
    .uint32be("Price")
    .uint32be("TimeinForce")
    .string("Display",{encoding: 'utf-8',length: 1})
  //  .buffer('OrderNumber', {length:8, formatter: (buf)=> { return buf.readBigUInt64BE() }})
    .uint64be('OrderNumber')
    .uint32be("MinimumQuantity")
    .string  ("OrderState",{encoding: 'utf-8',length: 1})
    .uint32be ("PreviousOrderToken")


const JNX_OUCH_OrderCanceled = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ("MessageType", {encoding: 'utf-8',length: 1})

    //.buffer('Timestamp', {length:8, formatter: (buf)=> { return buf.toJNXTimestamp() }})
    .uint64be('Timestamp', {formatter: (n)=>{ return n.toJNXTimestamp()}})

    .uint32be("OrderToken")
    .uint32be("DecrementQuantity")
    .string  ("OrderCanceledReason",{encoding: 'utf-8',length: 1})

const JNX_OUCH_OrderAIQCanceled = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ("MessageType", {encoding: 'utf-8',length: 1})

    //  .buffer('Timestamp', {length:8, formatter: (buf)=> { return buf.toJNXTimestamp() }})
    .uint64be('Timestamp', {formatter: (n)=>{ return n.toJNXTimestamp()}})

    .uint32be("OrderToken")
    .uint32be("DecrementQuantity")
    .string  ("OrderCanceledReason",{encoding: 'utf-8',length: 1})
    .uint32be("QuantityPreventedfromTrading")
    .uint32be("ExecutionPrice")
    .string  ("LiquidityIndicator",{encoding: 'utf-8',length: 1})


const JNX_OUCH_OrderExecuted = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ("MessageType", {encoding: 'utf-8',length: 1})
  //  .buffer  ('Timestamp', {length:8, formatter: (buf)=> { return buf.toJNXTimestamp() }})
    .uint64be('Timestamp', {formatter: (n)=>{ return n.toJNXTimestamp()}})
    .uint32be("OrderToken")
	.uint32be("ExecutedQuantity")
    .uint32be("ExecutionPrice")
    .string  ("LiquidityIndicator",{encoding: 'utf-8',length: 1})
//    .buffer  ('MatchNumber', {length:8, formatter: (buf)=> { return buf.readBigUInt64BE() }})
    .uint64be('MatchNumber')



const JNX_OUCH_OrderRejected  = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ("MessageType", {encoding: 'utf-8',length: 1})
//    .buffer  ('Timestamp', {length:8, formatter: (buf)=> { return buf.toJNXTimestamp() }})
    .uint64be('Timestamp', {formatter: (n)=>{ return n.toJNXTimestamp()}})
    .uint32be("OrderToken")
    .buffer  ("OrderRejectedReason",{encoding: 'utf-8',length: 1, formatter: (buf)=> { return '0x'+buf.toString('hex'); } })


const SoupBin_LoginRequest  = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ('Username', {encoding: 'utf-8',length: 6})
    .string  ('Password', {encoding: 'utf-8',length: 10})
    .string  ('RequestedSession', {encoding: 'utf-8',length: 10})
    .string  ('RequestedSequenceNumber', {encoding: 'utf-8',length: 20})

const SoupBin_ServerHeartbeat = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})


const SoupBin_LoginAccepted = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ('Session', {encoding: 'utf-8',length: 10})
    .string  ('SequenceNumber ', {encoding: 'utf-8',length: 20})

const SoupBin_LoginReject = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ('RejectReasonCode', {encoding: 'utf-8',length: 1})

const SoupBin_LogoutRequest = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})


const SoupBin_ClientHeartbeat = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})


const SoupBin_EndOfSession = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})


const SoupBin_Debug = new Parser()
    .uint16be('PacketLength')
    .string  ('PacketType', {encoding: 'utf-8',length: 1})
    .string  ('Text',{encoding: 'utf-8', greedy:true })


const jnx_fields_meta_data =

    {
        "MessageType": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "O": "Enter Order",
                "U": " If PktType==U : Replace| PktTyp==S : Replaced ",
                "X": "Cancel Order ",
                "A": "Order Accepted",
                "C": "Order Canceled ",
                "J": "Order Rejected ",
                "E": "Order Executed ",
                "D": "Order AIQ Canceled",
                "S": "System Event "
            }
        },
        "OrderToken": {
            "type": "JNX_Token",
            "len": 4,
            "validValues": {}
        },
        "ClientReference": {
            "type": "JNX_Alpha",
            "len": 10,
            "validValues": {}
        },
        "BuySellIndicator": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "B": "Buy",
                "S": "Sell",
                "T": "Short sell",
                "E": "Short sell exempt"
            }
        },
        "Quantity": {
            "type": "JNX_Integer",
            "len": 4,
            "validValues": {}
        },
        "OrderbookId": {
            "type": "JNX_Integer",
            "len": 4,
            "validValues": {}
        },
        "Group": {
            "type": "JNX_Alpha",
            "len": 4,
            "validValues": {
                "DAY": "Daytime J-Market",
                "NGHT ": "Nighttime J-Market",
                "DAYX": "X-Market",
                "DAYU": "U-Market"
            }
        },
        "Price": {
            "type": "JNX_Integer",
            "len": 4,
            "validValues": {}
        },
        "TimeinForce": {
            "type": "JNX_Integer",
            "len": 4,
            "validValues": {
                "0": "Immediate",
                "99999": "Day"
            }
        },
        "FirmId": {
            "type": "JNX_Integer",
            "len": 4,
            "validValues": {}
        },
        "Display": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "P": " Post-only"
            }
        },
        "Capacity": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "A": "Agency",
                "P": "Principal"
            }
        },
        "MinimumQuantity": {
            "type": "JNX_Integer",
            "len": 4,
            "validValues": {}
        },
        "OrderClassification": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "1": "Non HFT",
                "3": "HFT market making strategy",
                "4": "HFT arbitrage strategy",
                "5": "HFT directional strategy",
                "6": "HFT other strategy"
            }
        },
        "CashMarginType": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "1": "Cash",
                "2": "Margin open (Negotiable)",
                "3": "Margin close (Negotiable)",
                "4": "Margin open (Standardized)",
                "5": "Margin close (Standardized)"
            }
        },
        "ExistingOrderToken": {
            "type": "JNX_Token",
            "len": 4,
            "validValues": {}
        },
        "ReplacementOrderToken": {
            "type": "JNX_Token",
            "len": 4,
            "validValues": {}
        },
        "Timestamp": {
            "type": "JNX_Timestamp",
            "len": 8,
            "validValues": {}
        },
        "SystemEvent": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "S": "Start Of Day - Always the first message. Indicates the market is open and ready to start accepting orders",
                "E": "End Of Day - Indicates the market is closed and will not accept any new orders. There will be no further executions."
            }
        },
        "OrderNumber": {
            "type": "JNX_Integer",
            "len": 8,
            "validValues": {}
        },
        "OrderState": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "L": "Live ",
                "D": "Dead"
            }
        },
        "PreviousOrderToken": {
            "type": "JNX_Token",
            "len": 4,
            "validValues": {}
        },
        "DecrementQuantity": {
            "type": "JNX_Integer",
            "len": 4,
            "validValues": {}
        },
        "OrderCanceledReason": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "U": "User requested the order to be canceled. Sent in response to a Cancel Order Message or a Replace Order Message.",
                "L": "User logged off.",
                "S": "This order was manually canceled by a supervisory terminal. For example,emergency withdraw per user's request or the user got suspended.",
                "I": "An order with 'Immediate' Time In Force was executed and with no further matches available on the book the remaining quantity was canceled.",
                "M": "Order expired during match.",
                "X": "Invalid price.",
                "Z": "Invalid quantity.",
                "N": "Invalid minimum quantity.",
                "Y": "Invalid order type.",
                "D": "Invalid display type.",
                "V": "Exceeded order value limit.",
                "i": "Short sell order restriction.",
                "R": "Order not allowed at this time.",
                "F": "Flow control is enabled and this OUCH port is being throttled.",
                "G": "Margin order canceled due to margin restriction.",
                "O": "Other"
            }
        },
        "QuantityPreventedfromTrading": {
            "type": "JNX_Integer",
            "len": 4,
            "validValues": {}
        },
        "ExecutionPrice": {
            "type": "JNX_Integer",
            "len": 4,
            "validValues": {}
        },
        "LiquidityIndicator": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "A": "Added (for the passive firm)",
                "R": "Removed (for the aggressor)"
            }
        },
        "ExecutedQuantity": {
            "type": "JNX_Integer",
            "len": 4,
            "validValues": {}
        },
        "MatchNumber": {
            "type": "JNX_Integer",
            "len": 8,
            "validValues": {}
        },
        "OrderRejectedReason": {
            "type": "JNX_Alpha",
            "len": 1,
            "validValues": {
                "H": "There is currently a trading halt so no orders can be accepted on this orderbook at this time.",
                "S": "Invalid orderbook identifier.",
                "X": "Invalid price.",
                "Z": "Invalid quantity.",
                "N": "Invalid minimum quantity.",
                "Y": "Invalid order type.",
                "D": "Invalid display type.",
                "V": "Exceeded order value limit.",
                "i": "Short sell order restriction.",
                "R": "Order not allowed at this time.",
                "F": "Flow control is enabled and this OUCH port is being throttled.",
                "G": "Invalid margin specification.",
                "L": "MPID not allowed for this port.",
                "c": "User does not have permission to enter an order on the given board.",
                "O": "Other.",

                "0x48": "H - There is currently a trading halt so no orders can be accepted on this orderbook at this time.",
                "0x53": "S - Invalid orderbook identifier.",
                "0x58": "X - Invalid price.",
                "0x5a": "Z - Invalid quantity.",
                "0x4e": "N - Invalid minimum quantity.",
                "0x59": "Y - Invalid order type.",
                "0x44": "D - Invalid display type.",
                "0x56": "V - Exceeded order value limit.",
                "0x69": "i - Short sell order restriction.",
                "0x52": "R - Order not allowed at this time.",
                "0x46": "F - Flow control is enabled and this OUCH port is being throttled.",
                "0x47": "G - Invalid margin specification.",
                "0x4c": "L - MPID not allowed for this port.",
                "0x63": "c - User does not have permission to enter an order on the given board.",
                "0x4f": "O - Other."


            }
        },
        "RequestedSequenceNumber": {
            "type": "STRING",
            "len": 20,
            "validValues": {}
        },
        "RequestedSession": {
            "type": "STRING",
            "len": 10,
            "validValues": {}
        },
        "SequenceNumber": {
            "type": "STRING",
            "len": 20,
            "validValues": {}
        },
        "Session": {
            "type": "STRING",
            "len": 10,
            "validValues": {}
        },
        "Username": {
            "type": "STRING",
            "len": 6,
            "validValues": {}
        },
        "Password": {
            "type": "STRING",
            "len": 10,
            "validValues": {}
        },
        "Text": {
            "type": "STRING",
            "len": 100,
            "validValues": {}
        },
        "RejectReasonCode": {
            "type": "STRING",
            "len": 1,
            "validValues": {
                "A": "Not Authorized. There was an invalid username and password combination in the Login Request Message.",
                "S": "Session not available. The Requested Session in the Login Request Packet was either invalid or not available."
            }
        },
        "PacketLength": {
            "type": "INTEGER",
            "len": 2,
            "validValues": {}
        },
        "PacketType": {
            "type": "STRING",
            "len": 1,
            "validValues": {
                "L": "Login Request",
                "A": "Login Accepted",
                "J": "Login Reject",
                "O": "Logout Request",
                "R": "Client Heartbeat",
                "H": "Server Heartbeat",
                "Z": "End of Session",
                "+": "Debug Packet",
                "U": "UnSequenced",
                "S": "Sequenced"
            }
        }
    }


