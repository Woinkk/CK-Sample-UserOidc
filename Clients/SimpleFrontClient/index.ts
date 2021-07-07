import { AuthService, IUserInfo } from '@signature/webfrontauth';
import axios from 'axios';

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
  if( authService ) authService.removeOnChange(onAuthChange);
  authService = await AuthService.createAsync(
    {
      identityEndPoint: {
        hostname: epHostName.value,
        port: Number.parseInt(epPort.value),
        disableSsl: epDisableSsl.checked
      } 
    },
    axiosInstance
  )
  authService.addOnChange(onAuthChange);
  stopActivity();
  updateDisplay();
  
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
  await authService.startPopupLogin( popupLoginSchemes.value, popupLoginRememberMe.checked, JSON.parse( popupLoginUserData.value ) );
  stopActivity();
} 

async function logout() {
  startActivity();
  await authService.logout();
  stopActivity();} 

let authServiceHeader: HTMLElement;
let authServiceJson: HTMLElement;
let epHostName: HTMLInputElement;
let epPort: HTMLInputElement;
let epDisableSsl: HTMLInputElement;
let epApply: HTMLButtonElement;
let refreshFull: HTMLInputElement;
let refreshSchemes: HTMLInputElement;
let refreshVersion: HTMLInputElement;
let refreshSend: HTMLButtonElement;
let popupLoginSchemes: HTMLInputElement;
let popupLoginRememberMe: HTMLInputElement;
let popupLoginUserData: HTMLTextAreaElement;
let popupLoginSend: HTMLButtonElement;
let logoutSend: HTMLButtonElement;

document.onreadystatechange = async () => {
  if( document.readyState !== "complete" ) return;
  authServiceHeader = document.getElementById("authServiceHeader");
  authServiceJson = document.getElementById("authServiceJson");
  epHostName = document.getElementById("epHostName") as HTMLInputElement;
  epPort = document.getElementById("epPort") as HTMLInputElement;
  epDisableSsl = document.getElementById("epDisableSsl") as HTMLInputElement;
  epApply = document.getElementById("epApply") as HTMLButtonElement;

  refreshFull =  document.getElementById("refreshFull") as HTMLInputElement;
  refreshSchemes =  document.getElementById("refreshSchemes") as HTMLInputElement;
  refreshVersion =  document.getElementById("refreshVersion") as HTMLInputElement;
  refreshSend =  document.getElementById("refreshSend") as HTMLButtonElement;
  
  popupLoginSchemes = document.getElementById("popupLoginSchemes") as HTMLInputElement;
  popupLoginRememberMe = document.getElementById("popupLoginRememberMe") as  HTMLInputElement;
  popupLoginUserData = document.getElementById("popupLoginUserData") as HTMLTextAreaElement;
  popupLoginSend = document.getElementById("popupLoginSend") as HTMLButtonElement;

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
}

export default {
  refresh,
  startPopupLogin,
  logout,
  applyEndPoint
};