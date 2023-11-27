import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GenericResponse } from '@app/rvns-api';
import {
  NoteAttachmentData,
  NoteData,
  NoteWithRelationsData,
  WorkflowNoteData,
} from '@app/rvns-notes/data-access';
import { TemplateTypeEnum } from '@app/rvns-templates';
import { Observable, map, switchMap } from 'rxjs';
import { CreateNote, PatchNote } from '../domain/createNote';
import { NoteQueryParams } from '../domain/get-notes.params';

export type GetNoteDetailsResponse = GenericResponse<
  NoteWithRelationsData & {
    noteAttachments: NoteAttachmentData[];
  }
>;

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  public constructor(private http: HttpClient) {}

  public getNotes(
    params?: NoteQueryParams,
  ): Observable<GenericResponse<NoteData[]>> {
    return this.http.get<GenericResponse<NoteData[]>>('/api/notes', {
      params: {
        ...(params ?? {}),
        type: TemplateTypeEnum.Note,
      },
    });
  }

  public getNoteDetails(id: string): Observable<GetNoteDetailsResponse> {
    return this.http.get<GetNoteDetailsResponse>(`/api/notes/${id}`).pipe(
      switchMap((note) => {
        return this.getNoteAttachments(id).pipe(
          map((attachmentResponse) => ({
            ...note,
            data: {
              ...(note.data as NoteWithRelationsData),
              noteAttachments: attachmentResponse?.data ?? [],
            },
          })),
        );
      }),
    );
  }

  public createNote(
    createNote: CreateNote,
  ): Observable<GenericResponse<NoteWithRelationsData>> {
    return this.http.post<GenericResponse<NoteWithRelationsData>>(
      '/api/notes',
      createNote,
    );
  }

  public patchNote(
    noteId: string,
    patchNote: PatchNote,
  ): Observable<GenericResponse<NoteWithRelationsData>> {
    return this.http.patch<GenericResponse<NoteWithRelationsData>>(
      `/api/notes/${noteId}`,
      patchNote,
    );
  }

  public getNoteAttachments(
    id: string,
  ): Observable<GenericResponse<NoteAttachmentData[]>> {
    return this.http.get<GenericResponse<NoteAttachmentData[]>>(
      `/api/notes/${id}/attachments`,
    );
  }

  public deleteNote(
    noteId: string,
  ): Observable<GenericResponse<NoteWithRelationsData>> {
    return this.http.delete<GenericResponse<NoteWithRelationsData>>(
      `/api/notes/${noteId}`,
    );
  }

  public getOpportunityNotes(opportunityId: string): Observable<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GenericResponse<
      WorkflowNoteData & { noteAttachments: NoteAttachmentData[] }
    >
  > {
    return this.http
      .get<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        GenericResponse<WorkflowNoteData[]>
      >('/api/notes', {
        params: {
          opportunityId,
          type: 'workflow',
        },
      })
      .pipe(
        switchMap((notes) => {
          const note = notes.data![0];
          return this.getNoteAttachments(note.id).pipe(
            map((attachmentResponse) => ({
              ...notes,
              data: {
                ...(note as WorkflowNoteData),
                noteAttachments: attachmentResponse?.data ?? [],
              },

              // data: {
              //   ...(note.data as NoteWithRelationsData),
              //   noteAttachments: attachmentResponse?.data ?? [],
              // },
            })),
          );
        }),
      );
  }
}
