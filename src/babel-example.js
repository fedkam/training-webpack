// Example working bable

// @babel/polyfill
async function start() {
    return await Promise.resolve('async is working')
}
start().then(console.log)



// @babel/plugin-proposal-class-properties
class Until {
    static id = Date.now()
}
console.log('Until:', Until.id)



let unusedVariable = 'eslint example';