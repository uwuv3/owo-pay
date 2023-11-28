async function wait(timeout) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), timeout);
  });
}
module.exports = { wait };
