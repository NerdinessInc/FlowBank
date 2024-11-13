"use strict";exports.id=185,exports.ids=[185],exports.modules={71185:(e,t,r)=>{r.d(t,{Bz:()=>d,uL:()=>l,Cp:()=>p,Gk:()=>o,yq:()=>A,kV:()=>y,DZ:()=>u,$u:()=>m,mi:()=>C,jT:()=>f,G6:()=>g,wg:()=>h});var s=r(11737),a=r(6113),n=r.n(a);class i{constructor(){this.skey="*&@?#;<>",this.key=Buffer.alloc(0),this.IV=Buffer.from([18,52,86,120,144,171,205,239])}encryptText(e){return this.encrypt(e,this.skey)}encryptTextTdes(e){return this.encryptTDes(e,this.skey)}decryptText(e){return this.decrypt(e,this.skey)}decryptTextTdes(e){return this.decryptTDes(e,this.skey)}formatMoney(e){return parseFloat(e).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})}decrypt(e,t){try{this.key=Buffer.from(t.substring(0,8),"utf-8");let r=n().createDecipheriv("des",this.key,this.IV),s=r.update(Buffer.from(e,"base64"),"binary","utf-8");return s+=r.final("utf-8")}catch(e){return console.error(e),e.message}}decryptTDes(e,t){try{this.key=Buffer.from(t.substring(0,16),"utf-8");let r=n().createDecipheriv("des-ede3",this.key,this.IV),s=r.update(Buffer.from(e,"base64"),"binary","utf-8");return s+=r.final("utf-8")}catch(e){return console.error(e),e.message}}encrypt(e,t){try{this.key=Buffer.from(t.substring(0,8),"utf-8");let r=n().createCipheriv("des",this.key,this.IV),s=r.update(e,"utf-8","base64");return s+=r.final("base64")}catch(e){return console.error(e),e.message}}encryptTDes(e,t){try{this.key=Buffer.from(t.substring(0,16),"utf-8");let r=n().createCipheriv("des-ede3",this.key,this.IV),s=r.update(e,"utf-8","base64");return s+=r.final("base64")}catch(e){return console.error(e),e.message}}}let c=new i,o=async()=>{let{data:e}=await (0,s.py)("/NibssService/NibssAppService.asmx",'<ReturnGetThreeCodes xmlns="http://con.Ibplc.org/"><UIx>xxx</UIx></ReturnGetThreeCodes>');try{let t=e.ReturnGetThreeCodesResult;return{success:!0,data:t}}catch(e){return{success:!1,errorMessage:"Something went wrong!"}}},l=async e=>{let t=`
	<ReturnAuthuser xmlns="http://con.Ibplc.org/">
		<acCode>${c.encryptText(e.accessCode)}</acCode>
		<pwd>${c.encryptText(e.password)}</pwd>
		<uname>${c.encryptText(e.username)}</uname>
		<sid>${e.sid}</sid>
		
		<mThree>
			<Char1>${c.encryptText(e.access.Char1)}</Char1>
			<Char2>${c.encryptText(e.access.Char2)}</Char2>
			<Char3>${c.encryptText(e.access.Char3)}</Char3>
			<bool>${e.access.bool}</bool>
			<retMsg>${e.access.retMsg}</retMsg>
			<cAC>${e.access.cAC||""}</cAC>
		</mThree>
	</ReturnAuthuser>`.trim().replace(/\s+/g," "),{data:r}=await (0,s.py)("/NibssService/NibssAppService.asmx",t);try{let e=r.ReturnAuthuserResult,t=e.enumRec,s=e.oraresp;return{success:!s.errors,errorMessage:s.errmsg,profileNotFound:t.ProfileNotFound,accessCodeWrong:t.AccessCodeWrong,passwordWrong:t.PasswordWrong,userNameWrong:t.UserNameWrong,userAccountLocked:t.UserAccountLocked,numberOfAccounts:parseInt(r.NumberOfAccounts,10),...e}}catch(e){return{success:!1,errorMessage:"Something went wrong!"}}},d=async(e,t,r)=>{let a=`
	<ReturnAcctDetails2 xmlns="http://con.Ibplc.org/">
	  <ID>${e}</ID>
      <CustomerID>${r?.slice(1,2)?.[0].CustomerID}</CustomerID>
      <AccountNo>${r?.slice(1,2)?.[0].AccountNumber}</AccountNo>
      <pacesscode>${t.pAcessCode}</pacesscode>
      <pUsername>${t.pUserName}</pUsername>
	</ReturnAcctDetails2>`.trim().replace(/\s+/g," "),{data:n}=await (0,s.py)("/NibssService/NibssAppService.asmx",a);try{let e=n.ReturnAcctDetails2Result.rs.string.slice(1).map(e=>{let[t,r,s,a,n,i,c]=e.split("|");return{accountNumber:t,description:r,bookBalance:s,availBal:a,uncleared:n,currency:i,type:c}});return{success:!0,data:e}}catch(e){return{success:!1,errorMessage:"Something went wrong!"}}},u=async e=>{let t=`
    <PostTransferInternal xmlns="http://con.Ibplc.org/">
      <Bankmsg>
        <AccountIdentification1Field>${e.AccountIdentification1Field}</AccountIdentification1Field>
        <AccountIdentification2Field>${e.AccountIdentification2Field}</AccountIdentification2Field>
        <AccountType1Field>${e.AccountType1Field}</AccountType1Field>
        <AccountType2Field>${e.AccountType2Field}</AccountType2Field>
        <trfTypeField>${e.trfTypeField}</trfTypeField>
        <AcquiringInstIDField>${e.AcquiringInstIDField}</AcquiringInstIDField>
        <FowardingInstIDField>${e.FowardingInstIDField}</FowardingInstIDField>
        <AdditionalAmountsField>${e.AdditionalAmountsField}</AdditionalAmountsField>
        <AmountSettlementField>${e.AmountSettlementField}</AmountSettlementField>
        <AmountTransactionField>${e.AmountTransactionField}</AmountTransactionField>
        <CardAcceptorNameLocationField>${e.CardAcceptorNameLocationField}</CardAcceptorNameLocationField>
        <CardAcceptorTerminalIDField>${e.CardAcceptorTerminalIDField}</CardAcceptorTerminalIDField>
        <CardAcceptorTerminalIDCodeField>${e.CardAcceptorTerminalIDCodeField}</CardAcceptorTerminalIDCodeField>
        <CcyCodeCardHolderBillingField>${e.CcyCodeCardHolderBillingField}</CcyCodeCardHolderBillingField>
        <CcyCodeSettlementField>${e.CcyCodeSettlementField}</CcyCodeSettlementField>
        <CcyCodeTransField>${e.CcyCodeTransField}</CcyCodeTransField>
        <ConvRateCardHolderBillingField>${e.ConvRateCardHolderBillingField}</ConvRateCardHolderBillingField>
        <ConvRateSettlementField>${e.ConvRateSettlementField}</ConvRateSettlementField>
        <DateCaptureField>${e.DateCaptureField}</DateCaptureField>
        <DateLocalTransField>${e.DateLocalTransField}</DateLocalTransField>
        <DateSettlementField>${e.DateSettlementField}</DateSettlementField>
        <MacField>${e.MacField}</MacField>
        <MessageProcessingTypeField>${e.MessageProcessingTypeField}</MessageProcessingTypeField>
        <PrimaryAcctNoField>${e.PrimaryAcctNoField}</PrimaryAcctNoField>
        <ProcessingCodeField>${e.ProcessingCodeField}</ProcessingCodeField>
        <ReservedPrivate127Field>${e.ReservedPrivate127Field}</ReservedPrivate127Field>
        <ReservedPrivate60Field>${e.ReservedPrivate60Field}</ReservedPrivate60Field>
        <ResponseCodeField>${e.ResponseCodeField}</ResponseCodeField>
        <ResponseMessageField>${e.ResponseMessageField}</ResponseMessageField>
        <SystemAuditNumberField>${e.SystemAuditNumberField}</SystemAuditNumberField>
        <SystemAuditNumberXferField>${e.SystemAuditNumberXferField}</SystemAuditNumberXferField>
        <TimeLocalTransField>${e.TimeLocalTransField}</TimeLocalTransField>
        <TransDateTimeField>${e.TransDateTimeField}</TransDateTimeField>
      </Bankmsg>
    </PostTransferInternal>
  `.trim().replace(/\s+/g," ");try{let{data:e}=await (0,s.py)("/NibssService/NibssAppService.asmx",t),r=e.PostTransferInternalResult;return{success:!0,data:r}}catch(e){return{success:!1,errorMessage:"Something went wrong with the internal transfer!"}}},p=async e=>{let t=`
    <ReturnChangePass xmlns="http://con.Ibplc.org/">
      <Uname>${e.username}</Uname>
      <PacCode>${e.accessCode}</PacCode>
      <pwd>${e.newPassword}</pwd>
    </ReturnChangePass>`.trim().replace(/\s+/g," ");try{let{data:e}=await (0,s.py)("/NibssService/NibssAppService.asmx",t),r=e.ReturnChangePassResult;return{success:r.bool,data:r}}catch(e){return{success:!1,errorMessage:"Failed to change password. Please try again."}}},m=async e=>{let t=`
	<returnGetBenefInfo xmlns="http://con.Ibplc.org/">
      <pUsername>${e.pUserName}</pUsername>
      <pAccountnumber>''</pAccountnumber>
      <pCustomerid>${e.PXfChar2}</pCustomerid>
      <pAccountnameNew>''</pAccountnameNew>
      <pAcctCurrency>''</pAcctCurrency>
    </returnGetBenefInfo>`.trim().replace(/\s+/g," "),{data:r}=await (0,s.py)("/NibssService/NibssAppService.asmx",t);try{let e=r.returnGetBenefInfoResult.rs.string;return{success:!0,data:e}}catch(e){return{success:!1,errorMessage:"Something went wrong!"}}},g=async(e,t)=>{let r=`
	<returnSaveBenefInfo xmlns="http://con.Ibplc.org/">
      <pUsername>${e.pUserName}</pUsername>
      <pAccountnumber>${t.accountNumber}</pAccountnumber>
      <pCustomerid>${e.PXfChar2}</pCustomerid>
      <pAccountnameNew>${t.accountName}</pAccountnameNew>
      <pAcctCurrency>${t.currency}</pAcctCurrency>
    </returnSaveBenefInfo>`.trim().replace(/\s+/g," "),{data:a}=await (0,s.py)("/NibssService/NibssAppService.asmx",r);try{let e=a.returnSaveBenefInfoResult;return{success:e.retMsg,retVal2:e.retVal2,retVal:e.retVal}}catch(e){return{success:!1,errorMessage:"Something went wrong!"}}},y=async()=>{let e=`
    <ReturngetNeftBranches xmlns="http://con.Ibplc.org/" />
  `.trim().replace(/\s+/g," ");try{let{data:t}=await (0,s.py)("/NibssService/NibssAppService.asmx",e),r=t.ReturngetNeftBranchesResult.rs.string.slice(1).map(e=>{let[t,r,s,a,n,i,c,o]=e.split("|");return{bankcode:t,bankName:r,sortcode:s,sortcode1:a,cbncode:n,cbncode1:i,cbncode2:c,category:o}});return{success:!0,data:r}}catch(e){return{success:!1,errorMessage:"Failed to fetch NEFT branches. Please try again."}}},C=async(e,t)=>{let r=`
    <ReturnNameEnquiry xmlns="http://con.Ibplc.org/">
      <acctNo>${e}</acctNo>
      <BankCode>${t}</BankCode>
    </ReturnNameEnquiry>
  `.trim().replace(/\s+/g," ");try{let{data:e}=await (0,s.py)("/NibssService/NibssAppService.asmx",r),t=e.ReturnNameEnquiryResult;return console.log(e),{success:!0,data:t}}catch(e){return{success:!1,errorMessage:"Failed to perform name enquiry. Please try again."}}},A=async(e,t,r)=>{let a=`
    <ReturnHistDetails xmlns="http://con.Ibplc.org/">
      <acctno>${e}</acctno>
      <startdate>${t}</startdate>
      <enddate>${r}</enddate>
    </ReturnHistDetails>`.trim().replace(/\s+/g," ");try{let{data:e}=await (0,s.py)("/NibssService/NibssAppService.asmx",a),t=e.ReturnHistDetailsResult,r=t?.rs?.string?.slice(1).map(e=>{let[t,r,s,a,n,i,c,o,l,d,u,p,m,g,y,C,A,f,h,F,T,S,N,$,I,b,B,D,R,v,M,P,w,x]=e.split("|");return{COD_ACCT_NO:t,DAT_TXN:r,DAT_VALUE:s,AMT_TXN:a,CheckNo:n,trandesc:i,TXT_TXN_DESC:c,tranCode:o,COD_DRCR:l,userid:d,postseq:u,NAM_CUST_FULL:p,mobile:m,address:g,Ref_num:y,balance:C,RUNNING_BAL:A,DEBIT_AMT:f,CREDIT_AMT:h,OPENING_BAL:F,CLOSING_BAL:T,pSTART_DATE:S,END_DATE:N,TXT_CUSTADR_ADD1:$,TXT_CUSTADR_ADD2:I,TXT_CUSTADR_ADD3:b,NAM_CUST_SHRT:B,COD_ACCT_TITLE:D,COD_PROD:R,COD_CC_BRN:v,COD_CC_BRN_TXN:M,RAT_INT_RD:P,NAM_PRODUCT:w,NAM_BRANCH:x}});return{success:!0,data:r}}catch(e){return{success:!1,errorMessage:"Failed to retrieve account history details. Please try again."}}},f=async(e,t)=>{let r=`
    <ReturnPutXrefDetails xmlns="http://con.Ibplc.org/">
      <pUserTrfToken>
        <pSessionId>${t?.SessionId}</pSessionId>
        <NameEnquiryRef>''</NameEnquiryRef>
        <DestinationInstitutionCode>''</DestinationInstitutionCode>
        <ChannelCode>''</ChannelCode>
        <pInitTime>''</pInitTime>
        <pTokValue>''</pTokValue>
        <penqaccess>${e?.PXfChar2}</penqaccess>
        <pUname>${c.encryptText(e?.pUserName)}</pUname>
        <pStatus>''</pStatus>
        <Pamount>${t?.Amount}</Pamount>
        <pTransRef>''</pTransRef>
        <pTrfType>${t?.trfType}</pTrfType>
        <pTimeStamp>''</pTimeStamp>
        <pGsmStatus>''</pGsmStatus>
        <pUserEmail>${t?.email}</pUserEmail>
        <pUserGSM>${t?.gsm}</pUserGSM>
        <pSrcAcct>${t?.SrcAcct}</pSrcAcct>
        <OriginatorAccountName>''</OriginatorAccountName>
        <OriginatorAccountNumber>''</OriginatorAccountNumber>
        <OriginatorBankVerificationNumber>''</OriginatorBankVerificationNumber>
        <OriginatorKYCLevel>''</OriginatorKYCLevel>
        <pDestAcct>${t?.DestAcct}</pDestAcct>
        <BeneficiaryAccountName>''</BeneficiaryAccountName>
        <BeneficiaryAccountNumber>''</BeneficiaryAccountNumber>
        <BeneficiaryBankVerificationNumber>''</BeneficiaryBankVerificationNumber>
        <BeneficiaryKYCLevel>''</BeneficiaryKYCLevel>
        <TransactionLocation>''</TransactionLocation>
        <pFullName>${e?.pFullName}</pFullName>
        <Narration>''</Narration>
        <PaymentReference>''</PaymentReference>
        <retVal>true</retVal>
        <retMsg>''</retMsg>
        <theTree>
          <Char1>${t?.theTree.Char1}</Char1>
          <Char2>${t?.theTree.Char2}</Char2>
          <Char3>${t?.theTree.Char3}</Char3>
          <bool>${t?.theTree.bool}</bool>
          <retMsg>${t?.theTree.retMsg}</retMsg>
          <cAC>${t?.theTree.cAC}</cAC>
        </theTree>
        <AcAc>${c.encryptText(t?.TransferCode)}</AcAc>
        <pstatusLocal>''</pstatusLocal>
        <pstatusIntBank>''</pstatusIntBank>
        <pmsgString>''</pmsgString>
        <pDestAcctIntBnk>''</pDestAcctIntBnk>
        <pDestBenefIntBnk>''</pDestBenefIntBnk>
        <pDestBankCode>''</pDestBankCode>
        <psendOptions>${t?.sendOption}</psendOptions>
        <pBillPaymentRec>
          <pBillID>''</pBillID>
          <pPlatformName>''</pPlatformName>
          <pBillRef1>''</pBillRef1>
          <pBillRef2>''</pBillRef2>
          <pBillRef3>''</pBillRef3>
          <pCustName>''</pCustName>
          <pAcctTitle>''</pAcctTitle>
          <pSourceAcct>''</pSourceAcct>
          <pPayeeAcct>''</pPayeeAcct>
          <pBillMonth>''</pBillMonth>
          <pBillYear>''</pBillYear>
          <pBillStartDt>''</pBillStartDt>
          <pBillEndDt>''</pBillEndDt>
          <pTokenRefId>''</pTokenRefId>
          <pBillPayed>''</pBillPayed>
          <pBillAmount>''</pBillAmount>
          <pDB>''</pDB>
          <pEnqAcess>''</pEnqAcess>
          <pUserName>''</pUserName>
        </pBillPaymentRec>
      </pUserTrfToken>
    </ReturnPutXrefDetails>
  `.trim().replace(/\s+/g," ");try{let{data:e}=await (0,s.py)("/NibssService/NibssAppService.asmx",r),t=e.ReturnPutXrefDetailsResult;return console.log(t),{success:!0,data:t}}catch(e){return{success:!1,errorMessage:"Something went wrong! Please try again."}}},h=async e=>{console.log(e,"api");let t=`
    <SaveMessageDetails xmlns="http://con.Ibplc.org/">
      <msgDetails>
        <MessageDate>${e.messageDate}</MessageDate>
        <MessageStatus>${e.messageStatus}</MessageStatus>
        <MessageBody>${e.messageBody}</MessageBody>
        <MessageSenderName>${e.messageSenderName}</MessageSenderName>
        <MessageSenderEmail>${e.messageSenderEmail}</MessageSenderEmail>
        <MessageSenderPhone>${e.messageSenderPhone}</MessageSenderPhone>
        <MessageSenderCustId>${e.messageSenderCustId}</MessageSenderCustId>
        <MessageTypeId>${e.messageTypeId}</MessageTypeId>
        <OperationOk>true</OperationOk>
        <ErrorsOccured>false</ErrorsOccured>
        <ErrorMessage>''</ErrorMessage>
      </msgDetails>
    </SaveMessageDetails>
  `.trim().replace(/\s+/g," ");try{let{data:e}=await (0,s.py)("/NibssService/NibssAppService.asmx",t);console.log(e,"pol");let r=e.SaveMessageDetailsResult;return{success:!0,data:r}}catch(e){return{success:!1,errorMessage:"Failed to save message details. Please try again."}}}}};