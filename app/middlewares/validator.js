const validateCard = function(request, response, next) {
// paramètres attendus : title string, list_id number
// option : color string, postition number
    if (!request.body.title) {
        return response.status(400).json({error: 'Le paramètre title est obligatoire'});
    }
    if (!isNaN(parseInt(request.body.title))) {
        return response.status(400).json({error: 'Le paramètre title doit être une string'});
    }
    if (!request.body.list_id) {
        return response.status(400).json({error: 'Le paramètre list_id est obligatoire'});
    }
    if (isNaN(parseInt(request.body.list_id))) {
        return response.status(400).json({error: 'Le paramètre list_id doit être un number'});
    }
    if (request.body.color && !isNaN(parseInt(request.body.color))) {
        return response.status(400).json({error: 'Le paramètre color doit être une string'});
    }
    if (request.body.position && isNaN(parseInt(request.body.position))) {
        return response.status(400).json({error: 'Le paramètre position doit être un number'});
    }

    next();
}

module.exports = {
    validateCard
}