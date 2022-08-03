//** Wei Feng ASX OUCH Decoder  (ASX OUCH SR8)

var fixnetix= { trading :{ couch: {messages:{}, fields:{} }}};

function isValidHexString(h){
  var a = parseInt(h,16);
  return (a.toString(16) === h)
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*1); // 1 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
  
}

function hextoArrayBuffer(hexstr){
   bArray = hexstr.match(/.{2}/g)
  tArray = new Uint8Array( _.map(bArray,function(num){ return parseInt(num,16)}));
  return tArray.buffer;
}

function ArrayBufferToHexString(buf){
   arr = new Uint8Array(buf);
    arr = _.map(arr, function(num){ result=num.toString(16); return (  (result.length==1)? "0"+result : result)});
  return  arr.join(" ");
}

function ArrayBufferToHexString_NoPad(buf){
   arr = new Uint8Array(buf);
    arr = _.map(arr, function(num){ result=num.toString(16); return (  (result.length==1)? "0"+result : result)});
  return  arr.join('');
}

function ArrayBufferToASCIIString(buf){
  return String.fromCharCode.apply(null, new Uint8Array(buf));
  
}

function hex2ascii(hexx) {
    //console.log(hexx);
    //var hex = hexx.toString();//force conversion
    var hex = hexx+'';
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;

}





function ArrayBufferToInt(buf){
    switch (buf.byteLength) {
    case 1:
        return new DataView(buf).getUint8(0,false);
        break;    
    case 2:
        return new DataView(buf).getUint16(0,false);
        break;
    case 4:
        return new DataView(buf).getUint32(0,false);
        break;
    case 8:
       // return new DataView(buf).getFloat64(0,false);
        return hexToDec(ArrayBufferToHexString_NoPad(buf));
        break;
	case 12:
       // return new DataView(buf).getFloat64(0,false);
        return hexToDec(ArrayBufferToHexString_NoPad(buf));
        break;	
    default:
         return null;
    }
}

function HexToASCIIString(buf){
     return unescape(('' + buf).replace(/(..)/g, '%$1'))
}

function Typeof(x) {
    // Start with the typeof operator
    var t = typeof x;
    // If the result is not vague, return it
    if (t != "object")  return t;
    // Otherwise, x is an object. Get its class value to try to
    // find out what kind of object it is.
    var c = Object.prototype.toString.apply(x);  // Returns "[object class]"
    c = c.substring(8, c.length-1);              // Strip off "[object" and "]"
    return c;
} 

var kmap={};


function OUCH_DECODER(d){
        var hexarr=ArrayBufferToHexString(hextoArrayBuffer(d)).split(" ");


        var MessageType = hexarr.length>0 ?  hex2ascii(hexarr[2]) : "0";
        var Type =  hexarr.length>0 ? hex2ascii(hexarr[3]): "0";

     //   console.log(MessageType);
    //    console.log(Type);

                switch (MessageType) {
                    case "S":
                      switch (Type){
						
                       case "A"  :  return new fixnetix.trading.couch.messages.OrderAccepted(hextoArrayBuffer(d));
                       break;
                       case "J"  :  return new fixnetix.trading.couch.messages.OrderRejected(hextoArrayBuffer(d));
                       break;
                       case "C"  :  return new fixnetix.trading.couch.messages.OrderCanceled(hextoArrayBuffer(d));
                       break;
                       case "E"  :  return new fixnetix.trading.couch.messages.OrderExecuted(hextoArrayBuffer(d));
                       break;
                       case "U"  :  return new fixnetix.trading.couch.messages.OrderReplaced(hextoArrayBuffer(d));
                       break;
					   case "D"  :  return new fixnetix.trading.couch.messages.OrderAIQCanceled(hextoArrayBuffer(d));
                       break;
					   case "S"  :  return new fixnetix.trading.couch.messages.SystemEvent(hextoArrayBuffer(d));
                       break;
									
					 
                       default: return new couch_message();
                       }
                    break;

                    case "U":
                       switch (Type){
                       case "O"  :  return new fixnetix.trading.couch.messages.NewOrder(hextoArrayBuffer(d));
                       break;
                       case "U"  :  return new fixnetix.trading.couch.messages.ReplaceOrder(hextoArrayBuffer(d));
                       break;
                       case "X"  :  return new fixnetix.trading.couch.messages.CancelOrder(hextoArrayBuffer(d));
                       break;
					   
                      
                       default:  console.log("reach default"); return new couch_message();					   					   					  					   
                       }
                    break;


                    case "L":  return new fixnetix.trading.couch.messages.LoginRequest(hextoArrayBuffer(d));
                    break;

                    case "H":  return new fixnetix.trading.couch.messages.ServerHeartbeat(hextoArrayBuffer(d));
                    break;

                    case "A":  return new fixnetix.trading.couch.messages.LoginAccepted(hextoArrayBuffer(d));
                    break;

                    case "J":  return new fixnetix.trading.couch.messages.LoginReject(hextoArrayBuffer(d));
                    break;

                    case "O":  return new fixnetix.trading.couch.messages.LogoutRequest(hextoArrayBuffer(d));
                    break;
                    
					case "R":  return new fixnetix.trading.couch.messages.ClientHeartbeat(hextoArrayBuffer(d));
                    break;
                    
					case "Z":  return new fixnetix.trading.couch.messages.EndOfSession(hextoArrayBuffer(d));
                    break;
                    
					case "+":  return new fixnetix.trading.couch.messages.Debug(hextoArrayBuffer(d));
                    break;

                    default:
                        return null;

             }
    }





function couch_message(){
    //this.data = new buckets.Dictionary();
    //this.data = new Ext.util.HashMap();
    //this.version = '1.0';
    this.data = new ArrayBuffer();
    this.fields = new Array();
    
    this.getFields = function (t)
    {
        return this.fields;
    };
    
     this.getMsgSize = function (t)
    {
      return this.fields.length;
    };
    
     this.getField = function (t)
    {

      return  _.find( this.fields, function(field){  return (field.getClassName()==t? true: false)});
    };
    
    this.populateFields = function (d)
    
    {
            _.reduce(this.fields,
        function(memo, field) {
        field.setData( d.slice(memo,memo+field.field_length));
         return memo + field.field_length;
        }, 0, this);
    };
    
    this.getPipeString = function(){
     
       arr =  _.map( this.fields, function(field){ return (field.className) +"="+ field.getAnnotatedPrintValue()});
       return arr.join("| ");
    }

}



fixnetix.trading.couch.messages.DebugPacket = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.Text()
];
this.populateFields(d);
}

fixnetix.trading.couch.messages.LoginAccepted = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.Session(),
new fixnetix.trading.couch.fields.SequenceNumber()
];
this.populateFields(d);
}

fixnetix.trading.couch.messages.ServerHeartbeat = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType()
];
this.populateFields(d);
}



fixnetix.trading.couch.messages.LoginReject = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),

];
this.populateFields(d);
};




fixnetix.trading.couch.messages.LoginRequest = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.Username(),
new fixnetix.trading.couch.fields.Password(),
new fixnetix.trading.couch.fields.RequestedSession(),
new fixnetix.trading.couch.fields.RequestedSequenceNumber()
];
this.populateFields(d);
};

fixnetix.trading.couch.messages.LogoutRequest = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType()
];
this.populateFields(d);
};

fixnetix.trading.couch.messages.ClientHeartbeat = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType()
];
this.populateFields(d);
};

fixnetix.trading.couch.messages.NewOrder = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [

new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.ClientReference(),
new fixnetix.trading.couch.fields.BuySellIndicator(),
new fixnetix.trading.couch.fields.Quantity(),
new fixnetix.trading.couch.fields.OrderbookId(),
new fixnetix.trading.couch.fields.Group(),
new fixnetix.trading.couch.fields.Price(),
new fixnetix.trading.couch.fields.TimeinForce(),
new fixnetix.trading.couch.fields.FirmId(),

new fixnetix.trading.couch.fields.Display(),
new fixnetix.trading.couch.fields.Capacity(),
new fixnetix.trading.couch.fields.MinimumQuantity(),
new fixnetix.trading.couch.fields.OrderClassification(),
new fixnetix.trading.couch.fields.CashMarginType()

];
this.populateFields(d);
};


fixnetix.trading.couch.messages.CancelOrder = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.Quantity ()
];
this.populateFields(d);
};

fixnetix.trading.couch.messages.ReplaceOrder = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [

new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.ExistingOrderToken(),
new fixnetix.trading.couch.fields.ReplacementOrderToken(),
new fixnetix.trading.couch.fields.Quantity(),
new fixnetix.trading.couch.fields.Price(),
new fixnetix.trading.couch.fields.TimeinForce(),
new fixnetix.trading.couch.fields.Display(),
new fixnetix.trading.couch.fields.MinimumQuantity()

];
this.populateFields(d);
};


fixnetix.trading.couch.messages.OrderAccepted = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [

new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.ClientReference(),
new fixnetix.trading.couch.fields.BuySellIndicator(),
new fixnetix.trading.couch.fields.Quantity(),
new fixnetix.trading.couch.fields.OrderbookId(),
new fixnetix.trading.couch.fields.Group(),
new fixnetix.trading.couch.fields.Price(),
new fixnetix.trading.couch.fields.TimeinForce(),
new fixnetix.trading.couch.fields.FirmId(),
new fixnetix.trading.couch.fields.Display(),
new fixnetix.trading.couch.fields.Capacity(),
new fixnetix.trading.couch.fields.OrderNumber(),
new fixnetix.trading.couch.fields.MinimumQuantity(),
new fixnetix.trading.couch.fields.OrderState(),
new fixnetix.trading.couch.fields.OrderClassification(),
new fixnetix.trading.couch.fields.CashMarginType()

];
this.populateFields(d);
};

fixnetix.trading.couch.messages.OrderCanceled = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.DecrementQuantity(),
new fixnetix.trading.couch.fields.OrderCanceledReason()

];
this.populateFields(d);
};

fixnetix.trading.couch.messages.OrderAIQCanceled = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.DecrementQuantity(),
new fixnetix.trading.couch.fields.OrderCanceledReason(),

new fixnetix.trading.couch.fields.QuantityPreventedfromTrading(),
new fixnetix.trading.couch.fields.ExecutionPrice(),
new fixnetix.trading.couch.fields.LiquidityIndicator()

];
this.populateFields(d);
};



fixnetix.trading.couch.messages.OrderRejected = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.OrderRejectedReason()
];
this.populateFields(d);
};

fixnetix.trading.couch.messages.OrderReplaced = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [

new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp(),
new fixnetix.trading.couch.fields.ReplacementOrderToken(),
new fixnetix.trading.couch.fields.BuySellIndicator(),
new fixnetix.trading.couch.fields.Quantity(),
new fixnetix.trading.couch.fields.OrderbookId(),
new fixnetix.trading.couch.fields.Group(),
new fixnetix.trading.couch.fields.Price(),
new fixnetix.trading.couch.fields.TimeinForce(),
new fixnetix.trading.couch.fields.Display(),
new fixnetix.trading.couch.fields.OrderNumber(),
new fixnetix.trading.couch.fields.MinimumQuantity(),
new fixnetix.trading.couch.fields.OrderState(),
new fixnetix.trading.couch.fields.PreviousOrderToken()

];
this.populateFields(d);
};



fixnetix.trading.couch.messages.OrderExecuted = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [

new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.ExecutedQuantity(),
new fixnetix.trading.couch.fields.ExecutionPrice(),
new fixnetix.trading.couch.fields.LiquidityIndicator(),
new fixnetix.trading.couch.fields.MatchNumber(),

];
this.populateFields(d);
};

fixnetix.trading.couch.messages.SystemEvent = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [

new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp(),
new fixnetix.trading.couch.fields.SystemEvent()

];
this.populateFields(d);
};

/**
fixnetix.trading.couch.messages.OrderAccepted = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp_Nanoseconds(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.OrderbookID(),
new fixnetix.trading.couch.fields.Side(),
new fixnetix.trading.couch.fields.OrderID(),
new fixnetix.trading.couch.fields.Quantity(),
new fixnetix.trading.couch.fields.Price(),
new fixnetix.trading.couch.fields.TimeInForce(),
new fixnetix.trading.couch.fields.OpenClose(),
new fixnetix.trading.couch.fields.ClientAccount(),
new fixnetix.trading.couch.fields.OrderState(),
new fixnetix.trading.couch.fields.CustomerInfo(),
new fixnetix.trading.couch.fields.ExchangeInfo(),
new fixnetix.trading.couch.fields.ClearingParticipant(),
new fixnetix.trading.couch.fields.CrossingKey(),
new fixnetix.trading.couch.fields.CapacityofParticipant(),
new fixnetix.trading.couch.fields.DirectedWholesale(),
new fixnetix.trading.couch.fields.ExecutionVenue(),
new fixnetix.trading.couch.fields.IntermediaryID(),
new fixnetix.trading.couch.fields.OrderOrigin(),
new fixnetix.trading.couch.fields.Filler(),
new fixnetix.trading.couch.fields.OuchOrderType(),
new fixnetix.trading.couch.fields.ShortSellQuantity(),
new fixnetix.trading.couch.fields.MinimumAcceptableQuantity()
];
this.populateFields(d);
};

fixnetix.trading.couch.messages.OrderCanceled = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp_Nanoseconds(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.OrderbookID(),
new fixnetix.trading.couch.fields.Side(),
new fixnetix.trading.couch.fields.OrderID(),
new fixnetix.trading.couch.fields.Reason()
];
this.populateFields(d);
};

fixnetix.trading.couch.messages.OrderExecuted = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp_Nanoseconds(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.OrderbookID(),
new fixnetix.trading.couch.fields.TradedQuantity(),
new fixnetix.trading.couch.fields.TradePrice(),
new fixnetix.trading.couch.fields.MatchID(),
new fixnetix.trading.couch.fields.DealSource(),
new fixnetix.trading.couch.fields.MatchAttribute()
];
this.populateFields(d);
};

fixnetix.trading.couch.messages.OrderRejected = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp_Nanoseconds(),
new fixnetix.trading.couch.fields.OrderToken(),
new fixnetix.trading.couch.fields.RejectCode()
];
this.populateFields(d);
};

fixnetix.trading.couch.messages.OrderReplaced = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.Timestamp_Nanoseconds(),
new fixnetix.trading.couch.fields.ReplacementOrderToken(),
new fixnetix.trading.couch.fields.PreviousOrderToken(),
new fixnetix.trading.couch.fields.OrderbookID(),
new fixnetix.trading.couch.fields.Side(),
new fixnetix.trading.couch.fields.OrderID(),
new fixnetix.trading.couch.fields.Quantity(),
new fixnetix.trading.couch.fields.Price(),
new fixnetix.trading.couch.fields.TimeInForce(),
new fixnetix.trading.couch.fields.OpenClose(),
new fixnetix.trading.couch.fields.ClientAccount(),
new fixnetix.trading.couch.fields.OrderState(),
new fixnetix.trading.couch.fields.CustomerInfo(),
new fixnetix.trading.couch.fields.ExchangeInfo(),
new fixnetix.trading.couch.fields.ClearingParticipant(),
new fixnetix.trading.couch.fields.CrossingKey(),
new fixnetix.trading.couch.fields.CapacityofParticipant(),
new fixnetix.trading.couch.fields.DirectedWholesale(),
new fixnetix.trading.couch.fields.ExecutionVenue(),
new fixnetix.trading.couch.fields.IntermediaryID(),
new fixnetix.trading.couch.fields.OrderOrigin(),
new fixnetix.trading.couch.fields.Filler(),
new fixnetix.trading.couch.fields.OuchOrderType(),
new fixnetix.trading.couch.fields.ShortSellQuantity()
];
this.populateFields(d);
};



fixnetix.trading.couch.messages.ReplaceOrder = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.ExistingOrderToken(),
new fixnetix.trading.couch.fields.ReplacementOrderToken(),
new fixnetix.trading.couch.fields.Quantity(),
new fixnetix.trading.couch.fields.Price(),
new fixnetix.trading.couch.fields.OpenClose(),
new fixnetix.trading.couch.fields.ClientAccount(),
new fixnetix.trading.couch.fields.CustomerInfo(),
new fixnetix.trading.couch.fields.ExchangeInfo(),
new fixnetix.trading.couch.fields.CapacityofParticipant(),
new fixnetix.trading.couch.fields.DirectedWholesale(),
new fixnetix.trading.couch.fields.ExecutionVenue(),
new fixnetix.trading.couch.fields.IntermediaryID(),
new fixnetix.trading.couch.fields.OrderOrigin(),
new fixnetix.trading.couch.fields.Filler(),
new fixnetix.trading.couch.fields.ShortSellQuantity(),
new fixnetix.trading.couch.fields.MinimumAcceptableQuantity()
];
this.populateFields(d);
};



fixnetix.trading.couch.messages.CancelbyOrderID = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType(),
new fixnetix.trading.couch.fields.MessageType(),
new fixnetix.trading.couch.fields.OrderbookID(),
new fixnetix.trading.couch.fields.Side(),
new fixnetix.trading.couch.fields.OrderID()
]
this.populateFields(d);
};


**/
fixnetix.trading.couch.messages.EndofSession = function(d) { this.data = d; _.extend(this, new couch_message()); this.fields = [
new fixnetix.trading.couch.fields.PacketLength(),
new fixnetix.trading.couch.fields.PacketType()
]
this.populateFields(d);
};




