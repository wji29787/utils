const isFunction = (obj) => typeof obj === 'function';
const PENDDING = 'PENDDING'; // 初始化pendding 状态
const RESOLVED = 'RESOLVED'; // 初始化 resolve 状态
const REJECTED = 'REJECTED'; // 初始化 rejected 状态

// 回调的执行
const handleCallBack = (callback, status, result) => {
  const { onfulfilled, onrejected, resolve, reject, promise2 } = callback;
  try {
    if (status === RESOLVED) {
      const x = onfulfilled(result);

      resolvePromise(promise2, x, resolve, reject);
    } else if (status === REJECTED) {
      const x = onrejected(result);
      resolvePromise(promise2, x, resolve, reject);
    }
  } catch (e) {
    reject(e);
  }
};
const handleCallBacks = (callbacks, status, result) => {
  while (callbacks.length) {
    handleCallBack(callbacks.shift(), status, result);
  }
};
const transition = (promise, status, result) => {
  if (promise.status === PENDDING) {
    promise.status = status;
    promise.value = result;
    setTimeout(() => {
      handleCallBacks(promise.callbacks, status, result);
    }, 0);
  }
};
class MyPromise {
  constructor(executor) {
    this.status = PENDDING;
    this.value = undefined;

    this.callbacks = [];
    const resolve = (value) => {
      if (value instanceof MyPromise) {
        value.then(resolve, reject);
        return;
      }
      transition(this, RESOLVED, value);
    };
    const reject = (reason) => {
      transition(this, REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onfulfilled, onrejected) {
    onfulfilled = isFunction(onfulfilled) ? onfulfilled : (v) => v;
    onrejected = isFunction(onrejected)
      ? onrejected
      : (error) => {
          throw error;
        };
    let promise2 = new MyPromise((resolve, reject) => {
      const callback = { onfulfilled, onrejected, resolve, reject, promise2 };
      if (this.status === PENDDING) {
        this.callbacks.push(callback);
      } else {
        setTimeout(() => handleCallBack(callback, this.status, this.value), 0);
      }
    });
    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError('[TypeError:sdssd]'));
  }
  let called;
  if ((x && typeof x === 'object') || typeof x === 'function') {
    let then = x.then;
    if (typeof then === 'function') {
      then.call(
        x,
        (y) => {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        },
        (r) => {
          if (called) return;
          called = true;
          reject(r);
        }
      );
    } else {
      if (called) return;
      called = true;
      resolve(x);
    }
  } else {
    resolve(x);
  }
}
