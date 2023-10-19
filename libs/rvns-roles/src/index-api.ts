/*
  This file exports only elements dependent on NestJS libs
  that can not be imported in Angular.
 */
export { ROLES_KEY, Roles } from './lib/roles.decorator';
export { RolesGuard } from './lib/roles.guard';
export { RolesNestModule } from './lib/roles.nest.module';
