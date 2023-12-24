export function checkNatureNumber(num) {
  // 是否为正整数
  return Number.isInteger(num) && num >= 0;
}

export function checkNumberAndDecimals(num, decimals) {
  // 判断是否为位数在decimals以内的浮点数
  const pattern = getMaxDecimalsPattern(decimals);
  return pattern.test(num);
}

export function getMaxDecimalsPattern(decimals) {
  // 求出小数点后最多有decimals位的正则表达式
  return new RegExp(`^-?\\d+(\\.\\d{1,${decimals}})?$`);
}

export function countDecimals(num) {
  // 求出小数点后有几位
  return num % 1 != 0 ? num.toString().split(".")[1].length : 0;
}

export function isNumber(value) {
  return isTypeOf(value, "Number");
}

export function isTypeOf(value, type) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

export function compressImage(file, callback) {
  // 压缩图片
  const limitSize = 5120000;
  if (file.size > limitSize) {
    // 压缩图片
    let reader = new FileReader();
    let img = new Image();
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    reader.readAsDataURL(file);
    reader.onloadend = e => {
      img.src = e.target.result;
    };
    img.onload = () => {
      // 图片宽高比例
      let ratio = img.width / img.height;

      let targetHeight = Math.sqrt(limitSize / ratio);
      let targetWidth = targetHeight * ratio;

      // canvas对图片进行缩放
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      // 清除画布
      context.clearRect(0, 0, targetWidth, targetHeight);
      // 图片压缩
      context.drawImage(img, 0, 0, targetWidth, targetHeight);
      // canvas转为blob并上传
      canvas.toBlob(blob => {
        callback(blob);
      }, file.type || "image/png");
    };
  } else {
    callback(file);
  }
}

export function currencyText() {
  const currency = localStorage.getItem('currency')
  // let str = ''
  // switch (currency) {
  //   case 'AUD':
  //     str = 'AUD'
  //     break;
  //   case 'MYR':
  //     str = 'MYR'
  //     break
  //   case 'PHP':
  //     str ='PHP'
  //     break
  //   default:
  //     str = '元'
  //     break;
  // }
  // return str
  return currency || 'RMB'
}
export function currencyType() {
  const currency = localStorage.getItem('currency')
  // let str = ''
  // switch (currency) {
  //   case 'AUD':
  //     str = 'AUD'
  //     break;
  //   case 'MYR':
  //     str = 'MYR'
  //     break
  //   case 'PHP':
  //     str ='PHP'
  //     break
  //   default:
  //     str = '人民币'
  //     break;
  // }
  // return str
  return currency || 'RMB'
}
export function currencySymbol() {
  const currency = localStorage.getItem('currency')
  // let str = ''
  // switch (currency) {
  //   case 'AUD':
  //     str = 'AUD'
  //     break;
  //   case 'MYR':
  //     str = 'MYR'
  //     break
  //   case 'PHP':
  //     str ='PHP'
  //     break
  //   default:
  //     str = 'CNY'
  //     break;
  // }
  // return str
  return currency || 'RMB'
}
export function getPercentValue(valueList, idx, precision) {
  // 判断是否为空
  if (!valueList[idx]) {
    return 0;
  }
  // 求和
  var sum = valueList.reduce(function (acc, val) {
    return acc + (isNaN(val) ? 0 : val);
  }, 0)
  if (sum === 0) {
    return 0;
  }
  // 10的2次幂是100，用于计算精度。
  var digits = Math.pow(10, precision);
  // 扩大比例100，
  var votesPerQuota = valueList.map(function (val) {
    return (isNaN(val) ? 0 : val) / sum * digits * 100;
  })
  // 总数，扩大比例意味的总数要扩大
  var targetSeats = digits * 100;
  // 再向下取值，组成数组
  var seats = votesPerQuota.map(function (votes) {
    return Math.floor(votes);
  })
  // 再新计算合计，用于判断与总数量是否相同，相同则占比会100%
  var currentSum = seats.reduce(function (acc, val) {
    return acc + val;
  }, 0)
  // 余数部分的数组：原先数组减去向下取值的数组，得到余数部分的数组
  var remainder = votesPerQuota.map(function (votes, idx) {
    return votes - seats[idx];
  })
  // 给最大最大的余额加1，凑个占比100%；
  while (currentSum < targetSeats) {
    //  找到下一个最大的余额，给其加1
    var max = Number.NEGATIVE_INFINITY;
    var maxId = null;
    for (var i = 0, len = remainder.length; i < len; ++i) {
      if (remainder[i] > max) {
        max = remainder[i];
        maxId = i;
      }
    }
    // 对最大项余额加1
    ++seats[maxId];
    // 已经增加最大余数加1，则下次判断就可以不需要再判断这个余额数。
    remainder[maxId] = 0;
    // 总的也要加1，为了判断是否总数是否相同，跳出循环。
    ++currentSum;
  }
  // 这时候的seats就会总数占比会100%
  return seats[idx] / digits
}