type ArrItemKeyPath = string;
type ArrItemTemplate = any;

const protoToString = Object.prototype.toString;

function isObject(obj) {
  if (!obj) return false; // undefined null etc...
  const str = protoToString.call(obj);
  // 不考虑 '[object Module]', '[object Map]', '[object Set]'
  // 处理的是来自后端的 plain json object
  return str === '[object Object]';
}


function isNullOrUndefined(val) {
  return val === null || val === undefined;
}


function fillDataLogic<T>(key: string, options: {
  obj: any, template: T, arrItemTemplates?: Record<ArrItemKeyPath, ArrItemTemplate>
}): T {
  const { arrItemTemplates, template, obj } = options;
  const itemTemplates = arrItemTemplates || {};
  const newObj = {};
  Object.keys(template).forEach((currentKey) => {
    const keyPath = key ? `${key}.${currentKey}` : currentKey;
    const objVal = obj[currentKey];
    const templateVal = template[currentKey];

    // 模板值是数组
    if (Array.isArray(templateVal)) {
      if (!Array.isArray(objVal)) {
        newObj[currentKey] = templateVal;
      } else {
        const itemTemplate = itemTemplates[keyPath];
        // 如果对某个路径下的数组定义有 item 模板值，则尝试填充数组 item
        if (isObject(itemTemplate)) {
          objVal.forEach((objValArrItem, idx) => {
            if (isObject(objValArrItem)) {
              objVal[idx] = fillDataLogic(keyPath, { obj: objValArrItem, template: itemTemplate, arrItemTemplates });
            }
          });
        }
        newObj[currentKey] = objVal;
      }
      return;
    }

    const templateValType = typeof templateVal;
    const objValType = typeof objVal;
    // 模板值是对象
    if (templateValType === 'object') {
      if (!objVal || objValType !== 'object') {
        newObj[currentKey] = templateVal;

        // objVal templateVal 都是 object
      } else {
        newObj[currentKey] = fillDataLogic(keyPath, { obj: objVal, template: templateVal, arrItemTemplates });
      }
      return;
    }

    // 模板值是对象是其他类型的值

    if (isNullOrUndefined(objVal)) {
      newObj[currentKey] = templateVal;
    } else if (templateValType !== objValType) {
      newObj[currentKey] = templateVal;
    } else {
      newObj[currentKey] = objVal;
    }
  });
  return newObj as T;
}


/**
 * 填充模板值，通常用于保证数据的结构完整性
 * obj里没有的值，会从模板里填充过去
 * @param obj
 * @param template
 * @param arrItemTemplates
 * @returns
 */
export function fillDataByTemplate<T>(obj: any, template: T, arrItemTemplates?: Record<ArrItemKeyPath, ArrItemTemplate>): T {
  return fillDataLogic('', { obj, template, arrItemTemplates });
}

