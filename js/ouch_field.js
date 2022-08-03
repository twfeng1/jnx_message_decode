//** Wei Feng ASX OUCH Decoder  (ASX OUCH SR8)

var field_type = {
 JNX_Alpha: 7,
  JNX_Integer: 8,
 JNX_Token: 9,
 JNX_Timestamp: 10,
 
  STRING: 1,
  INTEGER: 2,
  REJECT_CODE: 3,
  FLOAT: 4,
  TIMESTAMP_NANOSECONDS: 5,
  ASX_SYMBOL: 6
};



//---------------------------------------------------------------------------------------------------------------------------
function couch_field(){
    this.getValue = function(){
        return "hello";
    };

    this.setData = function(dr){
        this.data=dr;
    };

    this.getData = function(){
        return this.data;
    };


    this.getPrintValue = function(){
        switch (this.field_type) {
			
            case field_type.JNX_Alpha:
                 var result = ArrayBufferToASCIIString(this.data).trim();
                 return _.isEmpty(result)? "[BLANK]": result;
            break;

            case field_type.JNX_Integer:
              return ( ArrayBufferToInt(this.data));
            break;

            case field_type.JNX_Token:
              return ( ArrayBufferToInt(this.data));
            break;			
			
			case field_type.JNX_Timestamp:
			 var dtInt = ArrayBufferToInt(this.data);
             var dt = new Date(parseInt(dtInt/1000000));
              var  formatted_time = dt.getUTCHours()+':'+ s.lpad(dt.getUTCMinutes(),2,"0") +":" + s.lpad(dt.getUTCSeconds(),2,"0")+"."+ dt.getUTCMilliseconds()+ " T " +dtInt%1000000 + "";
			 
              return ( ArrayBufferToInt(this.data))+ '('+formatted_time+')';
            break;	
			
			
			
            case field_type.INTEGER:
              return ( ArrayBufferToInt(this.data));
            break;

            case field_type.STRING:
                 var result = ArrayBufferToASCIIString(this.data).trim();
                 return _.isEmpty(result)? "[BLANK]": result;
            break;

            case field_type.FLOAT:
                result = ArrayBufferToInt(this.data);
                return Math.floor(result/10000) + "."+ result%10000 ;
            break;
/*
            case field_type.TIMESTAMP_NANOSECONDS:
             var dtInt = ArrayBufferToInt(this.data);
             var dt = new Date(parseInt(dtInt/1000000));
             return  dt.getUTCHours()+':'+ s.lpad(dt.getUTCMinutes(),2,"0") +":" + s.lpad(dt.getUTCSeconds(),2,"0")+"."+ dt.getUTCMilliseconds()+ " T " +dtInt%1000000 + " AU Local Time";
             break;
		**/	 
            case field_type.ASX_SYMBOL:
              var symbol = (ArrayBufferToHexString_NoPad(this.data)).slice(3).toUpperCase();
			 // console.log(symbol);
			 var ric = _.isEmpty(asx_symbol_map[symbol]) ? "" : " ("+asx_symbol_map[symbol]+".AX)";
			//  return symbol + " ("+asx_symbol_map[symbol]+".AX)";
			    return symbol + ric
            break;			 

            default:
                return ArrayBufferToASCIIString(this.data);

     }
    }

        this.getClassName = function(){

                      return this.className;

                 }


             this.getHexValue = function(){

                  return ArrayBufferToHexString(this.data);

             }


    this.getAnnotatedPrintValue = function(){
         var value = this.getPrintValue();
        //console.log(value);
         return   _.has ( this.validValues, value) ?  value +" (" + this.validValues[value] + ")"              : value;

    }

        this.getFieldTypeName = function(){
        switch (this.field_type) {
			
            case field_type.JNX_Alpha:
              return 'STRING';
            break;

            case field_type.JNX_Integer:
              return 'INTEGER';
            break;

            case field_type.JNX_Token:
              return 'TOKEN';
            break;			

			case field_type.JNX_Timestamp:
              return 'TIMESTAMP_NANOSEC';
            break;		
			
            case field_type.INTEGER:
              return 'INTEGER';
            break;

            case field_type.STRING:

                 return 'STRING';
            break;

            case field_type.FLOAT:

                return 'FLOAT';
            break;

            case field_type.ASX_SYMBOL:
              return 'INTEGER';
            break;
			
            default:
                return 'NONE';
				


     }
     }

}



//_.each ( _.keys(fixnetix.trading.couch.fields) , function(key){fixnetix.trading.couch.fields[key].prototype.className = key });


/**

fixnetix.trading.couch.fields.CapacityofParticipant = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'CapacityofParticipant'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 1; this.validValues = { "A":"Agency","P":"Principal","M":"Mixed Agency and Principal"};};
fixnetix.trading.couch.fields.ClearingParticipant = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ClearingParticipant'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 1; this.validValues = {};};
fixnetix.trading.couch.fields.ClientAccount = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Client-Account'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 10; this.validValues = {};};
fixnetix.trading.couch.fields.CrossingKey = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'CrossingKey'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.CustomerInfo = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'CustomerInfo'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 15; this.validValues = {};};
fixnetix.trading.couch.fields.DealSource = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'DealSource'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 2; this.validValues = {"1":"Single series to single series auto-matched during continuous trading.","20":"Single series to single series auto-matched during an auction.","36":"Tailor made combination match.","43":"Combination matched outright legs.","44":"Booked transaction resulting from Unintentional Crossing Prevention.","45":"Booked transaction resulting from Unintentional Crossing Prevention during an auction.","46":"Centre Point Preference Matched trade.","47":"Centre Point trade.","48":"Centre Point booked transaction resulting from Unintentional Crossing Prevention."};};
fixnetix.trading.couch.fields.DirectedWholesale = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'DirectedWholesale'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 1; this.validValues = {"Y":"True","N":"False (default)"};};
fixnetix.trading.couch.fields.ExchangeInfo = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ExchangeInfo'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 32; this.validValues = {};};
fixnetix.trading.couch.fields.ExecutionVenue = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ExecutionVenue'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.ExistingOrderToken = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ExistingOrderToken'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 14; this.validValues = {};};
fixnetix.trading.couch.fields.Filler = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Filler'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 8; this.validValues = {};};
fixnetix.trading.couch.fields.IntermediaryID = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'IntermediaryID'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 10; this.validValues = {};};
fixnetix.trading.couch.fields.MatchAttribute = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'MatchAttribute'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 1; this.validValues = {"0":"Passive, Not Crossed (Or Crossed with order that was not defined as Principal, Agency, or Mixed)","1":"Aggressive,  Not Crossed (Or Crossed with order that was not defined as Principal, Agency, or Mixed)","2":"Passive, Crossed with Principal","3":"Aggressive, Crossed with Principal","4":"Passive, Crossed with Agency","5":"Aggressive, Crossed with Agency","6":"Passive, Crossed with mixed Agency and Principal","7":"Aggressive, Crossed with mixed Agency and Principal"};};
fixnetix.trading.couch.fields.MatchID = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'MatchID'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 12; this.validValues = {};};
fixnetix.trading.couch.fields.MessageType = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'MessageType'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 1; this.validValues = {"O":"EnterOrder", "U":"ReplaceOrder","X":"CancelOrder","Y":"CancelbyOrderID","A":"OrderAccepted","J":"OrderRejected","C":"OrderCanceled","E":"OrderExecuted","U":"OrderReplaced"};};
fixnetix.trading.couch.fields.MinimumAcceptableQuantity = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'MinimumAcceptableQuantity'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 8; this.validValues = {};};
fixnetix.trading.couch.fields.OpenClose = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OpenClose'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 1; this.validValues = {"0":"Not used by ASX"};};
fixnetix.trading.couch.fields.OrderbookID = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderbookID'; this.data = arrbuf; this.field_type=  field_type.ASX_SYMBOL; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.OrderID = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderID'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 8; this.validValues = {};};
fixnetix.trading.couch.fields.OrderOrigin = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderOrigin'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 20; this.validValues = {};};
fixnetix.trading.couch.fields.OrderState = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderState'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 1; this.validValues = {"1":"On book","2":"Not on book","99":"OUCH order ownership lost"};};
fixnetix.trading.couch.fields.OrderToken = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderToken'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 14; this.validValues = {};};
fixnetix.trading.couch.fields.OuchOrderType = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OuchOrderType'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 1; this.validValues = {"Y":"Limit order.","N":"Centre Point Order (mid-point only). o Price > 0 defines a Centre Point Limit order. Price = 0 defines a Centre Point Market order.","D":"Centre Point Order (‘dark limit’ order with mid-tick flag enabled).","S":"Sweep order. Price > 0 defines a Limit Sweep order. Price = 0 defines a Market-to- Limit Sweep order.","P":"Sweep order (dual posted, i.e. midtick flag is enabled).","B":"Mid-point Centre Point Block Order with single fill MAQ","F":"Dark limit Centre Point Block Order with single fill MAQ","T":"Centre Point Sweep Order with single fill MAQ"};};
fixnetix.trading.couch.fields.PacketLength = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'PacketLength'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 2; this.validValues = {};};
fixnetix.trading.couch.fields.PacketType = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'PacketType'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 1; this.validValues = {"L":"Login Request", "A":"Login Accepted","J":"Login Reject","O":"Logout Request","R":"Client Heartbeat","H":"Server Heartbeat","Z":"End of Session","+":"Debug Packet","U":"UnSequenced","S":"Sequenced"};};
fixnetix.trading.couch.fields.Password = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Password'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 10; this.validValues = {};};
fixnetix.trading.couch.fields.PreviousOrderToken = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'PreviousOrderToken'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 14; this.validValues = {};};
fixnetix.trading.couch.fields.Price = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Price'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.Quantity = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Quantity'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 8; this.validValues = {};};
fixnetix.trading.couch.fields.Reason = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Reason'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 1; this.validValues = {"1":"Cancelled by user","4":"Order Inactivated due to connection loss","9":"Fill and Kill order that was deleted in an auction","10":"Order deleted by ASX on behalf of the participant","20":"Deleted by system due to instrument session change","21":"Inactivated by system due to instrument session change","24":"Inactivated Day Order"};};
fixnetix.trading.couch.fields.RejectCode = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'RejectCode'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.RejectReasonCode = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'RejectReasonCode'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 1; this.validValues = {"A":"Not Authorized. There was an invalid username and password combination in the Login Request Message.","S":"Session not available. The Requested Session in the Login Request Packet was either invalid or not available."};};
fixnetix.trading.couch.fields.ReplacementOrderToken = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ReplacementOrderToken'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 14; this.validValues = {};};
fixnetix.trading.couch.fields.RequestedSequenceNumber = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'RequestedSequenceNumber'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 20; this.validValues = {};};
fixnetix.trading.couch.fields.RequestedSession = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'RequestedSession'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 10; this.validValues = {};};
fixnetix.trading.couch.fields.SequenceNumber = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'SequenceNumber'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 20; this.validValues = {};};
fixnetix.trading.couch.fields.Session = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Session'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 10; this.validValues = {};};
fixnetix.trading.couch.fields.ShortSellQuantity = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ShortSellQuantity'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 8; this.validValues = {};};
fixnetix.trading.couch.fields.Side = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Side'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 1; this.validValues = {"B":"Buy order","S":"Sell order","T":"Short sell order","C":"Buy order in a Combination where the sell legs are short sells."};};
fixnetix.trading.couch.fields.Text = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Text'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 100; this.validValues = {};};
fixnetix.trading.couch.fields.TimeInForce = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'TimeInForce'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 1; this.validValues = {"0":"Day","3":"Immediate or Cancel (FaK)","4":"Fill or Kill","100":"Fill-and-kill immediately"};};
fixnetix.trading.couch.fields.Timestamp_Nanoseconds = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Timestamp_Nanoseconds'; this.data = arrbuf; this.field_type=  field_type.TIMESTAMP_NANOSECONDS; this.field_length = 8; this.validValues = {};};
fixnetix.trading.couch.fields.TradedQuantity = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'TradedQuantity'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 8; this.validValues = {};};
fixnetix.trading.couch.fields.TradePrice = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'TradePrice'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.Username = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Username'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 6; this.validValues = {};};

**/


//soupbin fields
fixnetix.trading.couch.fields.RequestedSequenceNumber = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'RequestedSequenceNumber'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 20; this.validValues = {};};
fixnetix.trading.couch.fields.RequestedSession = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'RequestedSession'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 10; this.validValues = {};};
fixnetix.trading.couch.fields.SequenceNumber = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'SequenceNumber'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 20; this.validValues = {};};
fixnetix.trading.couch.fields.Session = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Session'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 10; this.validValues = {};};
fixnetix.trading.couch.fields.Username = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Username'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 6; this.validValues = {};};
fixnetix.trading.couch.fields.Password = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Password'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 10; this.validValues = {};};
fixnetix.trading.couch.fields.Text = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Text'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 100; this.validValues = {};};
fixnetix.trading.couch.fields.RejectReasonCode = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'RejectReasonCode'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 1; this.validValues = {"A":"Not Authorized. There was an invalid username and password combination in the Login Request Message.","S":"Session not available. The Requested Session in the Login Request Packet was either invalid or not available."};};
fixnetix.trading.couch.fields.PacketLength = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'PacketLength'; this.data = arrbuf; this.field_type=  field_type.INTEGER; this.field_length = 2; this.validValues = {};};
fixnetix.trading.couch.fields.PacketType = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'PacketType'; this.data = arrbuf; this.field_type=  field_type.STRING; this.field_length = 1; this.validValues = {"L":"Login Request", "A":"Login Accepted","J":"Login Reject","O":"Logout Request","R":"Client Heartbeat","H":"Server Heartbeat","Z":"End of Session","+":"Debug Packet","U":"UnSequenced","S":"Sequenced"};};

//jnx ouch fields
fixnetix.trading.couch.fields.MessageType = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'MessageType'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"O":"Enter Order","U":" If PktType==U : Replace| PktTyp==S : Replaced ","X":"Cancel Order ","A":"Order Accepted","C":"Order Canceled ","J":"Order Rejected ","E":"Order Executed ","D":"Order AIQ Canceled","S":"System Event "};};
fixnetix.trading.couch.fields.OrderToken = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderToken'; this.data = arrbuf; this.field_type=  field_type.JNX_Token ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.ClientReference = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ClientReference'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 10; this.validValues = {};};
fixnetix.trading.couch.fields.BuySellIndicator = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'BuySellIndicator'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"B":"Buy","S":"Sell","T":"Short sell","E":"Short sell exempt"};};
fixnetix.trading.couch.fields.Quantity = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Quantity'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.OrderbookId = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderbookId'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.Group = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Group'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 4; this.validValues = {"DAY":"Daytime J-Market","NGHT ":"Nighttime J-Market","DAYX":"X-Market","DAYU":"U-Market"};};
fixnetix.trading.couch.fields.Price = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Price'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.TimeinForce = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'TimeinForce'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 4; this.validValues = {"0":"Immediate","99999":"Day"};};
fixnetix.trading.couch.fields.FirmId = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'FirmId'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.Display = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Display'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"P":" Post-only"};};
fixnetix.trading.couch.fields.Capacity = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Capacity'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"A":"Agency","P":"Principal"};};
fixnetix.trading.couch.fields.MinimumQuantity = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'MinimumQuantity'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.OrderClassification = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderClassification'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"1":"Non HFT","3":"HFT market making strategy","4":"HFT arbitrage strategy","5":"HFT directional strategy","6":"HFT other strategy"};};
fixnetix.trading.couch.fields.CashMarginType = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'CashMarginType'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"1":"Cash","2":"Margin open (Negotiable)","3":"Margin close (Negotiable)","4":"Margin open (Standardized)","5":"Margin close (Standardized)"};};
fixnetix.trading.couch.fields.ExistingOrderToken = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ExistingOrderToken'; this.data = arrbuf; this.field_type=  field_type.JNX_Token ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.ReplacementOrderToken = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ReplacementOrderToken'; this.data = arrbuf; this.field_type=  field_type.JNX_Token ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.Timestamp = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'Timestamp'; this.data = arrbuf; this.field_type=  field_type.JNX_Timestamp ; this.field_length = 8; this.validValues = {};};
fixnetix.trading.couch.fields.SystemEvent = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'SystemEvent'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"S":"Start Of Day - Always the first message. Indicates the market is open and ready to start accepting orders","E":"End Of Day - Indicates the market is closed and will not accept any new orders. There will be no further executions."};};
fixnetix.trading.couch.fields.OrderNumber = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderNumber'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 8; this.validValues = {};};
fixnetix.trading.couch.fields.OrderState = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderState'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"L":"Live ","D":"Dead"};};
fixnetix.trading.couch.fields.PreviousOrderToken = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'PreviousOrderToken'; this.data = arrbuf; this.field_type=  field_type.JNX_Token ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.DecrementQuantity = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'DecrementQuantity'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.OrderCanceledReason = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderCanceledReason'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"U":"User requested the order to be canceled. Sent in response to a Cancel Order Message or a Replace Order Message.","L":"User logged off.","S":"This order was manually canceled by a supervisory terminal. For example,emergency withdraw per user's request or the user got suspended.","I":"An order with 'Immediate' Time In Force was executed and with no further matches available on the book the remaining quantity was canceled.","M":"Order expired during match.","X":"Invalid price.","Z":"Invalid quantity.","N":"Invalid minimum quantity.","Y":"Invalid order type.","D":"Invalid display type.","V":"Exceeded order value limit.","i":"Short sell order restriction.","R":"Order not allowed at this time.","F":"Flow control is enabled and this OUCH port is being throttled.","G":"Margin order canceled due to margin restriction.","O":"Other"};};
fixnetix.trading.couch.fields.QuantityPreventedfromTrading = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'QuantityPreventedfromTrading'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.ExecutionPrice = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ExecutionPrice'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.LiquidityIndicator = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'LiquidityIndicator'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"A":"Added (for the passive firm)","R":"Removed (for the aggressor)"};};
fixnetix.trading.couch.fields.ExecutedQuantity = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'ExecutedQuantity'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 4; this.validValues = {};};
fixnetix.trading.couch.fields.MatchNumber = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'MatchNumber'; this.data = arrbuf; this.field_type=  field_type.JNX_Integer ; this.field_length = 8; this.validValues = {};};
fixnetix.trading.couch.fields.OrderRejectedReason = function (arrbuf){ _.extend(this,new couch_field()); this.className=   'OrderRejectedReason'; this.data = arrbuf; this.field_type=  field_type.JNX_Alpha ; this.field_length = 1; this.validValues = {"H":"There is currently a trading halt so no orders can be accepted on this orderbook at this time.","S":"Invalid orderbook identifier.","X":"Invalid price.","Z":"Invalid quantity.","N":"Invalid minimum quantity.","Y":"Invalid order type.","D":"Invalid display type.","V":"Exceeded order value limit.","i":"Short sell order restriction.","R":"Order not allowed at this time.","F":"Flow control is enabled and this OUCH port is being throttled.","G":"Invalid margin specification.","L":"MPID not allowed for this port.","c":"User does not have permission to enter an order on the given board.","O":"Other."};};

