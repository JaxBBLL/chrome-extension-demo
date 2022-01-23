setTimeout(()=>{chrome.runtime.sendMessage({from:"content",type:"SYNC_START"})},2e3);
