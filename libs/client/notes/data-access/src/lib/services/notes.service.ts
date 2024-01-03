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
  ): Observable<GenericResponse<{ items: NoteData[]; total: number }>> {
    return this.http.get<GenericResponse<{ items: NoteData[]; total: number }>>(
      '/api/notes',
      {
        params: {
          ...(params ?? {}),
          type: TemplateTypeEnum.Note,
        },
      },
    );
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
      {
        ...createNote,
        companyOpportunityTags: createNote.companyOpportunityTags?.map(
          (tag) => ({
            ...tag,
            companyTagId: tag.organisationId ?? '',
          }),
        ),
      },
    );
  }

  public patchNote(
    noteId: string,
    patchNote: PatchNote,
  ): Observable<GenericResponse<NoteWithRelationsData>> {
    return this.http.patch<GenericResponse<NoteWithRelationsData>>(
      `/api/notes/${noteId}`,
      {
        ...patchNote,
        companyOpportunityTags: patchNote.companyOpportunityTags?.map(
          (tag) => ({
            ...tag,
            companyTagId: tag.organisationId ?? '',
          }),
        ),
      },
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

  public getOpportunityNotes(
    opportunityId: string,
  ): Observable<WorkflowNoteData & { noteAttachments: NoteAttachmentData[] }> {
    return this.http
      .get<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        GenericResponse<{ items: WorkflowNoteData[]; total: number }>
      >('/api/notes', {
        params: {
          opportunityId,
          type: 'workflow',
        },
      })
      .pipe(
        switchMap(({ data }) => {
          const note = data!.items![0];
          return this.getNoteAttachments(note.id).pipe(
            map((attachmentResponse) => ({
              ...(note as WorkflowNoteData),
              noteAttachments: attachmentResponse?.data ?? [],
            })),
          );
        }),
      );
  }
}
