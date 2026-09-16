function requireAdmin(req, res, next){
    try{
        if(!req.user)
            return res.status(401).json({err: 'Unauthorized'})
        if(req.user.role !== 'admin')
            return res.status(403).json({err: 'This action requires admin privileges'})

        next()
    }catch{
        res.status(403).json({err: 'This action requires admin privileges'})
    }
}

module.exports = requireAdmin;