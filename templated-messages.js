module.exports = function (req, res, template) {
    return function (locals, temp) {
        var flash = req.flash(),
        types = Object.keys(flash),
        tempToRender = temp ? temp : template,
        output = '';

        if ((types.length) || (locals)) {
            if (tempToRender) {
                locals = locals || {};
                locals.flashes = flash;
                res.render(tempToRender, locals, function (err, html) {
                    if (html) {
                        output = html;
                    }
                });
            }
        }

        return output;
    };
};
