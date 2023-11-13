
// 验证手机号
export const testPhone = (value) => {
	const reg = /^1[3456789]\d{9}$/;
	return reg.test(value);
};

// 验证密码
export const testPwd = (value) => {
	const reg = /^[0-9a-zA-Z]{6,20}$/;
	return reg.test(value);
};

// 验证正整数
export const testPositiveInteger = (value) => {
	if(!value){
		return false
	}
	const reg =/^[+]{0,1}(\d+)$/;
	return reg.test(value);
};

// 验证 正数含小数点
export const testPositiveNumberFlot = (value)=>{
	if(!value){
		return false
	}
	const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
	return reg.test(value);
}