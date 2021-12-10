import * as moment from 'moment';

/**
 * Utils
 */
export class AppUtils {

  /**
   * Remove empty values into object (return a new object)
   * @param data object to clean
   */
  public static cleanObject(data: any, recursive: boolean = false) {
    const result = {}

    for (const i in data) {
      if (data[i] === undefined || (typeof data[i] === 'number' && isNaN(data[i])) || !this.isOwnedProperty(data[i])) {
        continue
      }

      if (recursive) {
        if (typeof data[i] === 'object') {
          result[i] = this.cleanObject(data[i])
        } else {
          result[i] = data[i]
        }
      } else {
        result[i] = data[i]
      }
    }

    return result
  }

  /**
   * Clean object to keep only "native" type items
   * @param data object to clean
   */
  static cleanObjectToNativeTypes(data: any, recursive: boolean = false) {
    const result = {}

    for (const i in data) {
      if (!this.isOwnedProperty(data[i])) {
        continue
      }

      if (recursive) {
        if (typeof data[i] === 'object') {
          result[i] = this.cleanObject(data[i])
        } else {
          result[i] = data[i]
        }
      } else {
        result[i] = data[i]
      }
    }

    return result
  }

  /**
   * Replace all properties with their new values
   */
  static replaceProperties(from: any, to: any) {
    const fromValid = this.cleanObject(from)

    for (const i in fromValid) {
      if (!fromValid.hasOwnProperty(i)) {
        continue
      }

      to[i] = fromValid[i]
    }

    return to
  }

  /**
   * Get the constructor name for an object
   */
  static constructorName(object: any) {
    if (object !== null && object.constructor) {
      return object.constructor.name
    }

    return null
  }

  /**
   * Know if a property is original for the object
   */
  static isOwnedProperty(object: any) {
    const constructorName = this.constructorName(object)

    if (constructorName === null || constructorName === 'Date' || constructorName === 'Number' || constructorName === 'String' || constructorName === 'Object' || constructorName === 'Boolean' || constructorName === 'Array') {
      return true
    }

    return false
  }

  /**
   * Sleep time
   */
  public static sleep(ms: number = 2000): Promise<void> {
    return new Promise((resolve, reject) => setTimeout(() => resolve(), ms))
  }

  /**
   * Re format dates in object (return a new object)
   */
  public static reformatDatesObject(data: any) {
    const result = {}

    for (const i in data) {
      if (data[i] instanceof Date) {
        result[i] = moment(data[i]).format('YYYY-MM-DD')
      } else {
        result[i] = data[i]
      }
    }

    return result
  }

}