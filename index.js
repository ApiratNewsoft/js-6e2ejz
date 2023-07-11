// Import stylesheets
import './style.css';

// 0. import LIFF SDK
import liff from "@line/liff"

// Body element
const body = document.getElementById("content")
//body.style.backgroundColor = "blue" 
//Profile elements
//const pictureUrl = document.getElementById("pictureUrl")
const userId = document.getElementById("userId")
const inputHotelCode = document.getElementById("inputHotelCode")
const displayName = document.getElementById("displayName")
const statusMessage = document.getElementById("statusMessage")
const email = document.getElementById("email")

let contextValue = null

// Button elements
const btnRegister = document.getElementById("btnRegister")

async function main(){
  btnRegister.style.display = "block";
  
  // 2. liff.ready
  // liff.ready.then(() => {
  //   if ( liff.getOS() === "android" ) {
  //      body.style.backgroundColor = "aliceblue"  
  //   } 
  //   if (liff.isInClient()) {
  //      getUserProfile()
  //   }
  // })
  // 3. Try a LIFF function
  // 4. Check where LIFF was opened
  // 5. Call GetUserProfile()
  // 10. Show register button

  // 1. Initialize LIFF app)
  liff.init({
    liffId: '2000070322-dVZlb20Q', // Use own liffId
  })
    .then(() => {
        // start to use LIFF's api
        liff.ready.then(() => {
          if ( liff.getOS() === "android" ) {
             body.style.backgroundColor = "aliceblue"  
          }else{
            body.style.backgroundColor = "white"; 
          }
          //console.log("getUserLanguage()");
          //getUserLanguage();   
          getContext();       
          if (liff.isInClient()) {
            //inputHotelCode.innerHTML = "<input type='text' class='form-control' id='InputHotelCode' placeholder='Hotel Code'>";
            //btnRegister.style.display = "block";
            // getUserProfile()
          }
        })
    })
    .catch((err) => {
      console.log("Error");
      console.log(err);
      body.style.backgroundColor = "#FFA07A"; 
    });
  // await liff.init({liffid: "2000070322-dVZlb20Q"}).then(() => {
  //   // Start to use liff's api
  //   console.log("start");
  //   body.style.backgroundColor = "white"; 
  // }).catch((err) => {
  //   // Error happens during initialization
  //   console.log("Error");
  //   console.log(err.code, err.message);
  //   body.style.backgroundColor = "#FFA07A" 
  // });
  
}
main();

// 6. Create .GetUserProfile()
// *7. Get email
async function getUserLanguage(){
  const lg = await liff.getLanguage()
  console.log("getUserLanguage :"+ lg);
  userId.innerHTML = "<b>User Language :</b>"+ lg;
}

// async function getContext(){
//   const context = liff.getContext();
//   contextValue = context;
//   // {"type": "utou", "userId": "U70e153189a29f1188b045366285346bc", "viewType": "full", "accessTokenHash": "ArIXhlwQMAZyW7SDHm7L2g", "availability": {"shareTargetPicker": {"permission": true, "minVer": "10.3.0"}, "multipleLiffTransition": {"permission": true, "minVer": "10.18.0"}}}
//    if (liff.isInClient()) {
//      userId.innerHTML = "<b>User ID :</b>"+ context.userId;
//      //userId.innerHTML = "<b>accessTokenHash :</b>"+ context.accessTokenHash; 
//    } else{
//     userId.innerHTML = "<b>context :</b>"+ context.accessTokenHash; 
//    }
// }

// async function getUserProfile(){
//   //liff.getUserProfile() new version not use
//   const profile = await liff.getUserProfile()
//   console.log("getUserProfile :"+ profile.userId)
//   //pictureUrl.src = profile.pictureUrl
//   userId.innerHTML = "<b>User Id</b>" + profile.userId
// }
// // 8. Create shareMsg//saveHotelCode

async function saveHotelCode(){

  const hotelCodeValue = document.getElementById("InputHotelCode")
  // 1. ดึงข้อมูลด้วย fetch   
  const crypto = require("crypto");

  const channelSecret = "10261d82915aa5a08bf302456e227d31"; // Channel secret string
  const context = liff.getContext();
  var   context_userId = '';
  if (liff.isInClient()) {
     context_userId = context.userId;
  } 
  var Reqbody = {   action:"registerhotelcode",
                    user:context_userId,
                    hotelCode:hotelCodeValue.value,
                    signature:"newsoft"}; // Request body string
  const newsoft_signature = crypto
    .createHmac("SHA256", channelSecret)
    .update(JSON.stringify( Reqbody))//.update(Reqbody)
    .digest("base64");

    Reqbody.signature = newsoft_signature; 
  // Compare x-line-signature request header and the signature

   console.log("newsoft_signature : ", newsoft_signature );
  const res = await fetch('https://662b-182-52-128-169.ngrok-free.app/webhookservice', {
    method: "POST", // or 'PUT'
    //mode: 'no-cors',
    headers: {
      "Content-Type": "application/json",
      //"newsoftsignature": "yFsncjLZQ6IKmXnamvYoyTrcoNTn2l7cTdmajLua+Y4=", //newsoftsignature not have value
    },
    body: JSON.stringify( Reqbody),
  }).then(response => {
    console.log("response ",response)
    if (response.status == 200) {
      alert('Save hotel code success.')
      liff.closeWindow()
     //return
   } //else {
      //alert('Save hotel code fail.')  
      //alert( response.json().ErrorMessage );
     //}
    return response.json()
  })
  .then(data =>{ 
    alert( data.Result.ErrorMessage );
    console.log("Json data response ",data)
    
  })
  .catch(error => console.error(error));

  //Request.body = "{"UserID":""}" +context.userId;
  // 2. หากอยากเช็ค status ก่อนก็สามารถทำได้เช่น ถ้าไม่ใช่ HTTP 200 OK ให้ error
  /*
   if (res.status == 200) {
      alert('Save hotel code success.')
     //return
   } else {
      alert('Save hotel code fail.')  
   }
  */

  // 3. แปลงเป็น json
  //const jsonData = await res.json() 
  
}

// 11. add close window

//9. Add event listener to share button
btnRegister.onclick = () => {
   saveHotelCode(); 
}