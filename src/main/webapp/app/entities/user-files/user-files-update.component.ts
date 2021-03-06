import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IUserFiles } from 'app/shared/model/user-files.model';
import { UserFilesService } from './user-files.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-user-files-update',
    templateUrl: './user-files-update.component.html'
})
export class UserFilesUpdateComponent implements OnInit {
    userFiles: IUserFiles;
    isSaving: boolean;

    users: IUser[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected userFilesService: UserFilesService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ userFiles }) => {
            this.userFiles = userFiles;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.userFiles.id !== undefined) {
            this.subscribeToSaveResponse(this.userFilesService.update(this.userFiles));
        } else {
            this.subscribeToSaveResponse(this.userFilesService.create(this.userFiles));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserFiles>>) {
        result.subscribe((res: HttpResponse<IUserFiles>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
