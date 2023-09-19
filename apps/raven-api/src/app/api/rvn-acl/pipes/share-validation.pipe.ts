import { HttpMethodEnum } from '../../../shared/enum/http-method.enum';
import { AuthorizationService } from '../authorization.service';
import { ShareAction } from '../enums/share-action.enum';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class ShareValidationPipe {
  protected actionOverride: ShareAction;

  public constructor(
    @Inject(REQUEST) protected readonly request,
    private readonly authService: AuthorizationService,
  ) {}

  public async validate(resource: string, action?: ShareAction): Promise<void> {
    action = action ? action : this.getActionFromMethod(this.request.method);
    await this.authService.authorize(this.request.user, action, resource);
  }

  protected getActionFromMethod(method: string): ShareAction {
    if (this.actionOverride) {
      return this.actionOverride;
    }
    const methodToShareActionMap = {
      [HttpMethodEnum.GET]: ShareAction.View,
      [HttpMethodEnum.POST]: ShareAction.Edit,
      [HttpMethodEnum.PATCH]: ShareAction.Edit,
      [HttpMethodEnum.PUT]: ShareAction.Edit,
      [HttpMethodEnum.DELETE]: ShareAction.Delete,
    };
    return methodToShareActionMap[method];
  }
}
