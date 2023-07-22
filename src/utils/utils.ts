
import { appInfoStore } from '@/store'
import { Message } from '@arco-design/web-vue'
import { formatThousandsSeparator } from '@/utils/tool'
//全局金额处理
export const getPoint = (value: number, type = 0) => {
    let result: number | string = 0
    if (type == 0) {
        result = value
            ? parseFloat(String(value)) / 10000
            : 0.00
        if (Number(appInfoStore().point_ratio) == 1) {
            result = getAreaMoney(result)
        } else {
            if (result != 0) {
                result = result.toFixed(2)
            }
        }
    } else if (type == 1) {
        result = value
            ? parseFloat(String(value)) / 10000
            : '0.00'
    } else if (type == 2) {
        result = value
            ? value * Number(appInfoStore().point_ratio)
            : 0
    } else if (type == 3) {
        if (Number(appInfoStore().point_ratio) == 1) {
            result = getAreaMoney(value)
        } else {
            result = value.toFixed(2)
        }
    }
    return formatThousandsSeparator(result)
}

//计算金额具体数值
export const getPointValue = (value: any, type = 0, ratio?: number) => {
    value = parseFloat(`${value}`) || 0
    let point_ratio = Number(appInfoStore().point_ratio)
    if (ratio) {
        point_ratio = ratio
    }
    let result: number | string = 0
    if (type == 0) {
        if (value) {
            result = parseFloat((value / point_ratio).toFixed(2))
        }
    } else if (type == 1) {
        if (value) {
            result = parseFloat((value * point_ratio).toFixed(2))
        }
    }
    return result
}


function getAreaMoney(val: number) {
    val /= 1000
    const init = parseInt(val)
    if (init == val) {
        return init + 'K'
    } else {
        return parseFloat(val.toFixed(3)) + 'K'
    }
}

// 全局百分比处理
export const getRatio = (value: number, type: number = 0) => {
    if (type === 0) {
        return ((value / 10000) * 100).toFixed(2) + '%'
    } else if (type === 1) {
        return (value / 100).toFixed(2) + '%'
    } else if (type === 2) {
        return (value * 100).toFixed(2) + '%'
    }
}

export const copyText = (text: any) => {
    //方案一
    let domInput = document.createElement('input')
    domInput.value = text
    document.body.appendChild(domInput) // 添加input节点
    domInput.select() // 选择对象;
    document.execCommand('Copy') // 执行浏览器复制命令
    Message.success({
        content: '已成功复制',
        duration: 2000
    })
    domInput.remove()
}

export const isCharacter = (str: string) => {
    const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
    return reg.test(str);
}
export const isEmail = (email: string) => {
    const reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
    return reg.test(email);
}

export const validCnpj = (cnpj: String) => {
    if (!cnpj) return false;

    cnpj = cnpj.replace(/[^\d]+/g, "");

    if (cnpj === "") return false;

    if (cnpj.length !== 14) return false;

    if (
        cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999"
    )
        return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
}
export const validCpf = (a: String) => {
    let add = 0;
    let rev = 0;
    let i = 0;
    if (((a = a.replace(/[^\d]+/g, "")), "" == a)) return !1;
    if (
        11 != a.length ||
        "00000000000" == a ||
        "11111111111" == a ||
        "22222222222" == a ||
        "33333333333" == a ||
        "44444444444" == a ||
        "55555555555" == a ||
        "66666666666" == a ||
        "77777777777" == a ||
        "88888888888" == a ||
        "99999999999" == a
    )
        return !1;
    for (add = 0, i = 0; i < 9; i++) add += parseInt(a.charAt(i)) * (10 - i);
    if (((rev = 11 - (add % 11)), (10 == rev || 11 == rev) && (rev = 0), rev != parseInt(a.charAt(9)))) return !1;
    for (add = 0, i = 0; i < 10; i++) add += parseInt(a.charAt(i)) * (11 - i);
    return (rev = 11 - (add % 11)), (10 == rev || 11 == rev) && (rev = 0), rev != parseInt(a.charAt(10)) ? !1 : !0;
}


// 登录APPID算法
export const DecodeAppid = (appstr: string) => {
    const decimalDict = "fgHijUvWXAbcdEyzKLMnOpqRst";
    let appid = 0
    const ll = appstr.length
    const dl = decimalDict.length
    for (let i = 0; i < ll; i++) {
        let n = decimalDict.indexOf(appstr[i])
        appid = appid * dl + n
    }
    return Number(appid)
}

export const copyObject = (from: object) => {
    return JSON.parse(JSON.stringify(from || {}))
}


export const getInitNumberParam = (value: any, init = 0) => {
    return typeof value == 'number' ? value : init
}

export const isJson = (str: any) => {
    try {
        if (typeof JSON.parse(str) == 'object') {
            return true
        }
    } catch (err) {
        return false
    }
}
export const payment_status = (value: number) => {
    if (value === 1) {
        return '未支付'
    } else if (value === 2) {
        return '已支付'
    } else if (value === 3) {
        return '退单'
    } else if (value === 99) {
        return '异常'
    }
}

