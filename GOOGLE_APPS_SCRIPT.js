// Google Apps Script — paste this into script.google.com
// Deploy as: Web App → Execute as: Me → Access: Anyone

var FOLDER_ID = '1kZOTaOmDpTRNpSBaSKjeTfkFELFZzwaH';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var folder = DriveApp.getFolderById(FOLDER_ID);
    
    var blob = Utilities.newBlob(
      Utilities.base64Decode(data.fileBase64),
      data.mimeType,
      data.fileName
    );
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileId: file.getId(),
      viewUrl: 'https://drive.google.com/file/d/' + file.getId() + '/view',
      thumbnailUrl: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w800',
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString(),
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
