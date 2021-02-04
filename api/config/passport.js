const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Player = require('../models/player')

passport.use(new LocalStrategy({
    usernameField: 'name'
}, async (name, password, done) => {
    const player = await Player.findOne({name: name});
    if (!player) {
        return done(null, false, { message: 'Usuario no encontrado'});
    } else {
        const match = await player.matchPassword(password);
        if(match) {
            return done(null, player);
        } else {
            return done(null, false, {message: 'Contraseña incorrecta'});
        }
    }
}));

passport.serializeUser((player, done) => {
    done(null, player.id);
});

passport.deserializeUser((id, done) => {
    Player.findById(id, (err, player) => {
        done(err, player);
    });
});