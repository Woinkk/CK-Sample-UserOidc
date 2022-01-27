import { AuthService, IUserInfo } from '@signature/webfrontauth';
import axios from 'axios';
import { version } from './WFATester.version';

//Initialize a new auth service
let identityEndPoint = {
  hostname: 'localhost',
  port: 5001,
  disableSsl: true
}

// We use one axios instance here.
const axiosInstance = axios.create();

const onAuthChange: (e: AuthService<IUserInfo>) => void = (e) => updateDisplay();

let authService: AuthService<IUserInfo>;
let requestCounter = 0;

function startActivity()
{
  if( ++requestCounter == 1 ) authServiceHeader.className = "blinking";
}

function stopActivity()
{
  if( --requestCounter == 0 ) authServiceHeader.className = "";
}

async function applyEndPoint() { 
  startActivity();
  epApply.disabled = true;
  refreshSend.disabled = true;
  popupLoginSend.disabled = true;
  logoutSend.disabled = true;
  if( authService ) {
    authService.removeOnChange(onAuthChange);
    authService.close();
  }

  authService = await AuthService.createAsync(
    {
      identityEndPoint: {
        hostname: epHostName.value,
        port: Number.parseInt(epPort.value),
        disableSsl: epDisableSsl.checked
      },
      useLocalStorage: epUseLocalStorage.checked,
      skipVersionsCheck: epCheckEndPointVersion.checked
    },
    axiosInstance
  )
  authService.addOnChange(onAuthChange);
  stopActivity();
  updateDisplay();
  
  configName.innerHTML = "Configuration (WFA client version: " + AuthService.clientVersion + ", WFATester version: "+version+")"
  epApply.disabled = false;
  refreshSend.disabled = false;
  popupLoginSend.disabled = false;
  logoutSend.disabled = false;
}

async function refresh() {
  startActivity();
  await authService.refresh( refreshFull.checked, refreshSchemes.checked, refreshVersion.checked );
  stopActivity();
} 

async function startPopupLogin() {
  startActivity();
  await authService.startPopupLogin( popupLoginSchemes.value, popupLoginRememberMe.checked, !!popupLoginUserData.value
    ? JSON.parse( popupLoginUserData.value )
    : undefined );
  stopActivity();
} 

async function startInlineLogin() {
  startActivity();
  await authService.startInlineLogin( inlineLoginScheme.value, inlineLoginReturnUrl.value ,inlineLoginRememberMe.checked, !!inlineLoginUserData.value
    ? JSON.parse( inlineLoginUserData.value )
    : undefined );
  stopActivity();
}

async function basicLogin() {
  startActivity();
  await authService.basicLogin( basicLoginUserName.value, basicLoginPassword.value, basicLoginRememberMe.checked, !!basicLoginUserData.value 
    ? JSON.parse( basicLoginUserData.value )
    : undefined );
  stopActivity();
}

async function logout() {
  startActivity();
  await authService.logout();
  stopActivity();
} 

async function impersonate() {
  startActivity();
  await authService.impersonate( impersonateUsername.value );
  stopActivity();
} 

async function unsafeDirectLogin() {
  startActivity();
  await authService.unsafeDirectLogin( unsafeDirectLoginProvider.value, !!unsafeDirectLoginPayload.value 
    ? JSON.parse( unsafeDirectLoginPayload.value )
    : undefined, 
    unsafeDirectLoginRememberMe.checked );
  stopActivity();
}

function shrink(className: string, buttonClassName: string) {
  let shrinkingContent = document.getElementById(className);
  let button = document.getElementById(buttonClassName);
  if (shrinkingContent.style.display != "none") {
    shrinkingContent.style.display = "none";
    button.style.transform = "rotateZ(-90deg)";
  } else {
    shrinkingContent.style.display = "flex";
    button.style.transform = "rotateZ(90deg)";
  }
}

let authServiceHeader: HTMLElement;
let authServiceJson: HTMLElement;
let configName: HTMLElement;
let epHostName: HTMLInputElement;
let epPort: HTMLInputElement;
let epDisableSsl: HTMLInputElement;
let epUseLocalStorage: HTMLInputElement;
let epCheckEndPointVersion: HTMLInputElement;
let epApply: HTMLButtonElement;
let userAuthLevel: HTMLElement;
let userId: HTMLElement;
let userActualUser: HTMLElement;
let refreshFull: HTMLInputElement;
let refreshSchemes: HTMLInputElement;
let refreshVersion: HTMLInputElement;
let refreshSend: HTMLButtonElement;
let popupLoginSchemes: HTMLSelectElement;
let popupLoginRememberMe: HTMLInputElement;
let popupLoginUserData: HTMLTextAreaElement;
let popupLoginSend: HTMLButtonElement;
let inlineLoginScheme: HTMLSelectElement;
let inlineLoginRememberMe: HTMLInputElement;
let inlineLoginReturnUrl: HTMLInputElement;
let inlineLoginUserData: HTMLTextAreaElement;
let inlineLoginSend: HTMLButtonElement;
let basicLoginUserName: HTMLInputElement;
let basicLoginRememberMe: HTMLInputElement;
let basicLoginPassword: HTMLInputElement;
let basicLoginUserData: HTMLTextAreaElement;
let basicLoginSend: HTMLButtonElement;
let impersonateUsername: HTMLInputElement;
let impersonateSend: HTMLButtonElement;
let unsafeDirectLoginProvider: HTMLInputElement;
let unsafeDirectLoginRememberMe: HTMLInputElement;
let unsafeDirectLoginPayload: HTMLTextAreaElement;
let unsafeDirectLoginSend: HTMLButtonElement;
let logoutSend: HTMLButtonElement;

document.onreadystatechange = async () => {
  if( document.readyState !== "complete" ) return;
  authServiceHeader = document.getElementById("authServiceHeader");
  authServiceJson = document.getElementById("authServiceJson");
  configName = document.getElementById("configName");
  epHostName = document.getElementById("epHostName") as HTMLInputElement;
  epPort = document.getElementById("epPort") as HTMLInputElement;
  epDisableSsl = document.getElementById("epDisableSsl") as HTMLInputElement;
  epUseLocalStorage = document.getElementById("epUseLocalStorage") as HTMLInputElement;
  epCheckEndPointVersion = document.getElementById("epCheckEndPointVersion") as HTMLInputElement;
  epApply = document.getElementById("epApply") as HTMLButtonElement;

  userAuthLevel = document.getElementById("userAuthLevel") as HTMLElement;
  userId = document.getElementById("userId") as HTMLElement;
  userActualUser = document.getElementById("userActualUser") as HTMLElement;

  refreshFull =  document.getElementById("refreshFull") as HTMLInputElement;
  refreshSchemes =  document.getElementById("refreshSchemes") as HTMLInputElement;
  refreshVersion =  document.getElementById("refreshVersion") as HTMLInputElement;
  refreshSend =  document.getElementById("refreshSend") as HTMLButtonElement;
  
  popupLoginSchemes = document.getElementById("popupLoginSchemes") as HTMLSelectElement;
  popupLoginRememberMe = document.getElementById("popupLoginRememberMe") as  HTMLInputElement;
  popupLoginUserData = document.getElementById("popupLoginUserData") as HTMLTextAreaElement;
  popupLoginSend = document.getElementById("popupLoginSend") as HTMLButtonElement;

  inlineLoginScheme = document.getElementById("inlineLoginScheme") as HTMLSelectElement;
  inlineLoginRememberMe = document.getElementById("inlineLoginRememberMe") as HTMLInputElement;
  inlineLoginReturnUrl = document.getElementById("inlineLoginReturnUrl") as HTMLInputElement;
  inlineLoginUserData = document.getElementById("inlineLoginUserData") as HTMLTextAreaElement;
  inlineLoginSend = document.getElementById("inlineLoginSend") as HTMLButtonElement;

  basicLoginUserName = document.getElementById("basicLoginUserName") as HTMLInputElement;
  basicLoginRememberMe = document.getElementById("basicLoginRememberMe") as HTMLInputElement;
  basicLoginPassword = document.getElementById("basicLoginPassword") as HTMLInputElement;
  basicLoginUserData = document.getElementById("basicLoginUserData") as HTMLTextAreaElement;
  basicLoginSend = document.getElementById("basicLoginSend") as HTMLButtonElement;

  impersonateUsername = document.getElementById("impersonateUsername") as HTMLInputElement;
  impersonateSend = document.getElementById("impersonateSend") as HTMLButtonElement;

  unsafeDirectLoginProvider = document.getElementById("unsafeDirectLoginProvider") as HTMLInputElement;
  unsafeDirectLoginRememberMe = document.getElementById("unsafeDirectLoginRememberMe") as HTMLInputElement;
  unsafeDirectLoginPayload = document.getElementById("unsafeDirectLoginPayload") as HTMLTextAreaElement;
  unsafeDirectLoginSend = document.getElementById("unsafeDirectLoginSend") as HTMLButtonElement;

  logoutSend = document.getElementById("logoutSend") as HTMLButtonElement;

  await applyEndPoint();
};

async function updateDisplay() {
  const clean = {
    authenticationInfo: authService.authenticationInfo,
    availableSchemes: authService.availableSchemes,
    endPointVersion: authService.endPointVersion,
    refreshable: authService.refreshable,
    rememberMe: authService.rememberMe,
    token: authService.token,
    currentError: authService.currentError
  };
  authServiceJson.innerText = JSON.stringify( clean, undefined, 3 );
  popupLoginSchemes.innerHTML = "";
  inlineLoginScheme.innerHTML = "";
  if (authService.availableSchemes.includes("Basic")) basicLoginSend.disabled = false;
  else basicLoginSend.disabled = true;
  authService.availableSchemes.forEach(scheme => {
    popupLoginSchemes.options.add(new Option(scheme) as HTMLOptionElement);
    inlineLoginScheme.options.add(new Option(scheme) as HTMLOptionElement);
  });

  let authLevelText;
  switch (authService.authenticationInfo.level) {
    case 0:
      authLevelText = "None";
      userAuthLevel.style.backgroundColor = "#000";
      break;
    case 1:
      authLevelText = "Unsafe";
      userAuthLevel.style.backgroundColor = "red";
      break;
    case 2:
      authLevelText = "Normal";
      userAuthLevel.style.backgroundColor = "green";
      break;
    case 3:
      authLevelText = "Critical";
      userAuthLevel.style.backgroundColor =  "blue";
      break;
    default:
      authLevelText = "None";
      userAuthLevel.style.backgroundColor = "#000";
  }

  userAuthLevel.innerHTML = authLevelText;
  userId.innerText = authService.authenticationInfo.user.userName+" (Id: "+authService.authenticationInfo.user.userId.toString()+")";
  userActualUser.innerText = authService.authenticationInfo.actualUser.userName+" (Id: "+authService.authenticationInfo.actualUser.userId.toString()+")";
  if(!authService.authenticationInfo.isImpersonated) {
    userActualUser.parentElement.remove();
  }
}

export default {
  refresh,
  startPopupLogin,
  startInlineLogin,
  basicLogin,
  logout,
  impersonate,
  unsafeDirectLogin,
  applyEndPoint,
  shrink
};