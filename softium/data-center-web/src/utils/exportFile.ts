import {Modal} from 'antd'

export function  downloadFile(res: any){
    const downloadFromLocalBlob=(fileName:any, content:any, type:any)=> {
    const blob = content instanceof Blob ? content : new Blob([content], {type: type})
    if('msSaveOrOpenBlob' in navigator) {
      window.navigator.msSaveOrOpenBlob(blob, fileName)
    } else {
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.type = type;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) ;
      document.body.removeChild(elink)
    }
  }

    const downloadFromExtenalUrl=({url,name,mime}:any={})=> {
    if (url) {
      const elink = document.createElement('a')
      elink.download = name
      elink.type = mime
      elink.style.display = 'none'
      elink.target = '_blank'
      elink.href = url
      document.body.appendChild(elink)
      elink.click()
      document.body.removeChild(elink)
    }
  }

    const getBase64=(file:any)=> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    })
  }

    if (res.config.responseType == 'blob') {
      if (res.headers.filename && !res.data.type.includes('application/json')) {
        const fileName = decodeURIComponent(res.headers.filename)
        downloadFromLocalBlob(fileName, res.data, res.data.type)
      } else {
        let reader = new FileReader()
        reader.onload = e => {
          // @ts-ignore
          if (e.target.readyState === 2) {
            // @ts-ignore
            let error = typeof e.target.result === "string" ? JSON.parse(<string>e.target.result) : e.target.result
            Modal.error({
              width:720,
              title: '错误',
              content: error.message,
              centered: true
            })
          }
        }
        reader.readAsText(res.data)
      }
    } else {
      downloadFromExtenalUrl(res.data)
    }
  return downloadFile
}
