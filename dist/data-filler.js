(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['data-filler'] = {}));
}(this, (function (exports) { 'use strict';

  var protoToString = Object.prototype.toString;
  function isObject(obj) {
      if (!obj)
          return false; // undefined null etc...
      var str = protoToString.call(obj);
      // 不考虑 '[object Module]', '[object Map]', '[object Set]'
      // 处理的是来自后端的 plain json object
      return str === '[object Object]';
  }
  function isNullOrUndefined(val) {
      return val === null || val === undefined;
  }
  function fillDataLogic(key, options) {
      var arrItemTemplates = options.arrItemTemplates, template = options.template, obj = options.obj;
      var itemTemplates = arrItemTemplates || {};
      var newObj = {};
      Object.keys(template).forEach(function (currentKey) {
          var keyPath = key ? key + "." + currentKey : currentKey;
          var objVal = obj[currentKey];
          var templateVal = template[currentKey];
          // 模板值是数组
          if (Array.isArray(templateVal)) {
              if (!Array.isArray(objVal)) {
                  newObj[currentKey] = templateVal;
              }
              else {
                  var itemTemplate_1 = itemTemplates[keyPath];
                  // 如果对某个路径下的数组定义有 item 模板值，则尝试填充数组 item
                  if (isObject(itemTemplate_1)) {
                      objVal.forEach(function (objValArrItem, idx) {
                          if (isObject(objValArrItem)) {
                              objVal[idx] = fillDataLogic(keyPath, { obj: objValArrItem, template: itemTemplate_1, arrItemTemplates: arrItemTemplates });
                          }
                      });
                  }
                  newObj[currentKey] = objVal;
              }
              // 模板值是对象
          }
          else if (typeof templateVal === 'object') {
              if (!objVal || typeof objVal !== 'object') {
                  newObj[currentKey] = templateVal;
                  // objVal templateVal 都是 object
              }
              else {
                  newObj[currentKey] = fillDataLogic(keyPath, { obj: objVal, template: templateVal, arrItemTemplates: arrItemTemplates });
              }
          }
          else {
              newObj[currentKey] = isNullOrUndefined(objVal) ? templateVal : objVal;
          }
      });
      return newObj;
  }
  /**
   * 填充模板值，通常用于保证数据的结构完整性
   * obj里没有的值，会从模板里填充过去
   * @param obj
   * @param template
   * @param arrItemTemplates
   * @returns
   */
  function fillDataByTemplate(obj, template, arrItemTemplates) {
      return fillDataLogic('', { obj: obj, template: template, arrItemTemplates: arrItemTemplates });
  }

  exports.fillDataByTemplate = fillDataByTemplate;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
