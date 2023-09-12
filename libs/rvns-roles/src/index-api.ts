/*
  This file exports only elements dependent on NestJS libs
  that can not be imported in Angular.
 */
export { RolesNestModule } from './lib/roles.nest.module';
export { RolesGuard } from './lib/roles.guard';
export { ROLES_KEY } from './lib/roles.decorator';
export { Roles } from './lib/roles.decorator';
