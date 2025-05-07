



import {PDFDocument} from 'pdf-lib';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';
import {Dilemma} from "../constants/interfaces";

export async function generatePDF(specificDilemma: Dilemma): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([2480, 3508]);

    // Inhalte auf die PDF-Seite schreiben
    specificDilemma.pro.forEach((p, index) => {
        let argument = p.description
        if (argument.length > 45){
            argument = argument.substring(0, 30) +"...";
        }
        page.drawText(argument, {x: 100, y: 3100 - 80 * index, size: 50});
    })
    specificDilemma.contra.forEach((c, index) => {
        let argument = c.description
        if (argument.length > 30){
            argument = argument.substring(0, 30) +"...";
        }
        page.drawText(argument, {x: 1290, y: 3100 - 80 * index, size: 50});
    })


    // Uint8Array zurückgeben
    return await pdfDoc.save();
}

// PDF speichern und teilen
export async function saveAndSharePDF(pdfBytes: Uint8Array, fileName: string): Promise<void> {
    // PDF in Base64 umwandeln
    const base64Data = btoa(String.fromCharCode(...pdfBytes));

    // Datei speichern
    const fileWriteResult = await Filesystem.writeFile({
        path: fileName+".pdf",
        data: base64Data,
        directory: Directory.Documents
    });

    // Abgerufenes Datei-URI
    const fileUri = fileWriteResult.uri;

    console.log("PDF erfolgreich gespeichert:", fileUri);

    // Datei teilen
    await Share.share({
        title: "Teile dein PDF",
        text: "Hier ist dein PDF!",
        url: fileUri, // Korrekte Datei-URL verwenden
        dialogTitle: "PDF teilen"
    });

    console.log("PDF erfolgreich geteilt!");
}




