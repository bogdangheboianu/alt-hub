import { NgModule } from '@angular/core';
import { FormatDocumentTypePipe } from '@documents/pipes/format-document-type.pipe';

const Pipes = [
    FormatDocumentTypePipe
];

@NgModule( {
               declarations: Pipes,
               exports     : Pipes
           } )
export class DocumentPipesModule {
}
