window.onload = function(){
    var reg1 = /^1[3|4|5|6|7|8]\d{9}$/; // 手机号码的正则表达式
    var regqq = /^[1-9]\d{4,}$/; // QQ号正则表达式
    var regnc = /^[\u4e00-\u9fa5]{2,8}$/; // 昵称
    var regpw = /^[a-zA-Z0-9_-]{6,16}$/;

    // 获取元素
    var tel = document.querySelector('#tel');
    var qq = document.querySelector('#qq');
    var nc = document.querySelector('#nc');
    var pwd = document.querySelector('#pwd');
    var surepwd = document.querySelector('#surepwd');
    // 调用函数
    regexp(tel,reg1); // 手机号
    regexp(qq,regqq); // qq号
    regexp(nc, regnc); // 昵称
    regexp(pwd,regpw); // 密码

    // 封装函数
    function regexp(ele, reg){
        ele.onblur = function(){
            if(this.value == ''){
                return;
            }else if(reg.test(this.value)){
                // console.log('正确的');
                // 下一个兄弟的类名
                this.nextElementSibling.className ='success';
                this.nextElementSibling.innerHTML = '<i class="success_icon"></i>恭喜你输入正确';
            }else {
                // console.log('不正确的');
                this.nextElementSibling.className ='error';
                this.nextElementSibling.innerHTML = '<i class="error_icon"></i>输入格式不正确，请重新输入';
            }
        }  
    }
    surepwd.onblur = function(){
        if(this.value == pwd.value || pwd.value == this.value){
            this.nextElementSibling.className ='success';
            this.nextElementSibling.innerHTML = '<i class="success_icon"></i>恭喜你输入正确';
        }else {
             this.nextElementSibling.className ='error';
             this.nextElementSibling.innerHTML = '<i class="error_icon"></i>两次密码输入不一致';
        }
    }
}