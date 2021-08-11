class Flash {
    constructor(req){
        this.req = req
        this.success = this.extractFlashMessage('success')
        this.fail = this.extractFlashMessage('fail')
    }

    extractFlashMessage = (name) =>{
        let message = this.req.flash(name);
        return message = message.length > 0 ? message[0] : false
    }

    static getMessage = (req) => {
        let flash = new Flash(req)

        return {
            success : flash.success,
            fail : flash.fail
        }
    }
}

module.exports = Flash;