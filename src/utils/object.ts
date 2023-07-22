import camelcase from 'lodash.camelcase'

export function isPlainObject(obj: { [key: string]: any }): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function objectCamelcase(object: object) {
  const stringify = JSON.stringify(object, (_key: string, value: any) => {
    if (value && isPlainObject(value)) {
      const replacement: { [key: string]: any } = {}
      // eslint-disable-next-line no-restricted-syntax
      for (const k in value) {
        if (Object.hasOwnProperty.call(value, k)) {
          replacement[camelcase(k)] = value[k]
        }
      }
      return replacement
    }

    return value
  })

  return JSON.parse(stringify)
}
