/**
 * Created by Sunday on 2018/1/10.
 */
const vc = {
  mr: [{required: true, message: '此处不能为空'}],
  userName: [{required: true, message: '此处不能为空'}],
  realName: [{pattern: /^[\u4e00-\u9fa5]+$/, message: '请输入正确用户名'}],
  email: [{type: 'email', message: '请输入正确邮箱'}],
  int: [{type: 'integer', min: 0, message: '请输入正整数'}],
  pass: [{required: true, message: '密码不能为空'}, {min: 5, max: 10, message: '密码为5-10位字符'}],
  rale: [{type: 'integer', min: 0, max: 100, message: '请输入0-100的正整数'}],
  qq: [{pattern: /^[1-9]([0-9]{5,11})$/, message: '请输入正确QQ号'}],
  mobile: [{pattern: /^0?(13|14|15|18)[0-9]{9}$/, message: '请输入正确手机号'}],
  url: [{pattern: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/, message: '请输入网站'}],
  bankcard: [{required: true, message: '开户账号不能为空'}, {pattern: /^([1-9]{1})(\d{15}|\d{18})$/, message: '银行卡账号为16和19位'}]
}
export default vc
