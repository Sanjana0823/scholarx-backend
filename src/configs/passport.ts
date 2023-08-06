import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { dataSource } from './dbConfig'
import Profile from '../entities/profile.entity'
import { JWT_SECRET } from './envConfig'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const profileRepository = dataSource.getRepository(Profile)
      const profile = await profileRepository.findOne({
        where: { uuid: jwtPayload.userId }
      })

      if (!profile) {
        done(null, false)
      } else {
        done(null, profile)
      }
    } catch (error) {
      done(error, false)
    }
  })
)

export default passport
