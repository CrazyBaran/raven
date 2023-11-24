/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type,@angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ENVIRONMENT } from '@app/client/core/environment';
import {
  IFilePickerOptions,
  IPicker,
  MSALAuthenticate,
  Picker,
  Popup,
} from '@app/client/files/sdk-pnptimeline';
import { MsalService } from '@azure/msal-angular';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {getToken} from "codelyzer/angular/styles/cssLexer";

@Component({
  selector: 'app-picker-a',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PickerComponentAbc {
  // protected app = inject(PublicClientApplication);
  protected env = inject(ENVIRONMENT);
  protected msal = inject(MsalService);

  public async createWindow(e: MouseEvent): Promise<void> {
    e.preventDefault();

    const baseUrl = "{base url to target file source, more details in the docs}";

    /**
     * Combines an arbitrary set of paths ensuring and normalizes the slashes
     *
     * @param paths 0 to n path parts to combine
     */
    function combine(...paths:any[]) {

      return paths
          .map(path => path.replace(/^[\\|/]/, "").replace(/[\\|/]$/, ""))
          .join("/")
          .replace(/\\/g, "/");
    }

    // the options we pass to the picker page through the querystring
    const params = {
      sdk: "8.0",
      entry: {
        oneDrive: {
          files: {},
        }
      },
      authentication: {},
      messaging: {
        origin: "http://localhost:3000",
        channelId: "27"
      },
      typesAndSources: {
        mode: "files",
        pivots: {
          oneDrive: true,
          recent: true,
        },
      },
    };

    let win:any = null;
    let port:any = null;




      win = window.open("", "Picker", "width=800,height=600")

      const authToken = this.
          await getToken({
        resource: baseUrl!,
        command: "authenticate",
        type: "SharePoint",
      });

      const queryString = new URLSearchParams({
        filePicker: JSON.stringify(params),
      });

      const url = combine(baseUrl, `_layouts/15/FilePicker.aspx?${queryString}`);

      const form = win.document.createElement("form");
      form.setAttribute("action", url);
      form.setAttribute("method", "POST");
      win.document.body.append(form);

      const input = win.document.createElement("input");
      input.setAttribute("type", "hidden")
      input.setAttribute("name", "access_token");
      input.setAttribute("value", authToken);
      form.appendChild(input);

      form.submit();

      window.addEventListener("message", (event) => {

        if (event.source && event.source === win) {

          const message = event.data;

          if (message.type === "initialize" && message.channelId === params.messaging.channelId) {

            port = event.ports[0];

            port.addEventListener("message", messageListener);

            port.start();

            port.postMessage({
              type: "activate",
            });
          }
        }
      });


    async function messageListener(message) {
      switch (message.data.type) {

        case "notification":
          console.log(`notification: ${message.data}`);
          break;

        case "command":

          port.postMessage({
            type: "acknowledge",
            id: message.data.id,
          });

          const command = message.data.data;

          switch (command.command) {

            case "authenticate":

              // getToken is from scripts/auth.js
              const token = await getToken(command);

              if (typeof token !== "undefined" && token !== null) {

                port.postMessage({
                  type: "result",
                  id: message.data.id,
                  data: {
                    result: "token",
                    token,
                  }
                });

              } else {
                console.error(`Could not get auth token for command: ${JSON.stringify(command)}`);
              }

              break;

            case "close":

              win.close();
              break;

            case "pick":

              console.log(`Picked: ${JSON.stringify(command)}`);

              document.getElementById("pickedFiles").innerHTML = `<pre>${JSON.stringify(command, null, 2)}</pre>`;

              port.postMessage({
                type: "result",
                id: message.data.id,
                data: {
                  result: "success",
                },
              });

              win.close();

              break;

            default:

              console.warn(`Unsupported command: ${JSON.stringify(command)}`, 2);

              port.postMessage({
                result: "error",
                error: {
                  code: "unsupportedCommand",
                  message: command.command
                },
                isExpected: true,
              });
              break;
          }

          break;
      }
    }
  }
}
