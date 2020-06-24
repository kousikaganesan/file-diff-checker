import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { Component, ViewChild } from '@angular/core';
import { FileUploadService } from './service/file-upload.service'
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('App Component', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let debugElement: DebugElement;
    let htmlElement: HTMLElement;
    let service: FileUploadService;
    let serviceStub: FileUploadService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                HttpClientModule
            ],
            providers: [{ provide: FileUploadService, useValue: serviceStub }, HttpClientModule]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        htmlElement = debugElement.nativeElement;
        service = fixture.debugElement.injector.get(FileUploadService);
    }));

    it('should call compareFiles() when compare button is clicked ', async(() => {
        spyOn(component, 'compareFiles');
        let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();

        fixture.whenStable().then(() => {
            expect(component.compareFiles).toHaveBeenCalled();
        })
    }));

    it('will have the both `ViewChild`s defined', () => {
        expect(fixture.componentInstance.fileInputOne).toBeDefined();
        expect(fixture.componentInstance.fileInputTwo).toBeDefined();
    });

    it('will clear error', () => {
        fixture.detectChanges();
        component.clearError();
        expect(component.showError).toBe(false);
        expect(component.isShowSpinner).toBe(false);
    });

    it('will throw error for undefined files', () => {
        fixture.detectChanges();
        expect(component.showError).toBe(false);
        expect(component.isShowSpinner).toBe(false);
        component.compareFiles();
    })

    it('will compare files', () => {
        fixture.detectChanges();
        spyOn(component, 'compareFiles');
        component.fileInputOne.nativeElement.files[0] = new File([''], 'test-file1', { type: 'text/xml' });
        component.fileInputTwo.nativeElement.files[0] = new File([''], 'test-file2', { type: 'text/xml' });
        component.compareFiles();
        expect(component.showError).toBe(false);
    })

    it('will throw error if file types are different', () => {
        fixture.detectChanges();
        component.fileInputOne.nativeElement.files[0] = new File([''], 'test-file.xml', { type: 'text/xml' });
        component.fileInputTwo.nativeElement.files[0] = new File([''], 'test-file.csv', { type: 'text/csv' });
        component.compareFiles();
        expect(component.showError).toBe(true);
    })

});