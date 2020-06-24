const _ = require('lodash');
let multer = require('multer')
let upload = multer()
let fs = require('fs');

let { RESPONSE,
    UPLOAD_PATH,
    XML_REGEX,
    TEXTFILE_REGEX,
    FIND_NEWLINE_REGEX } = require('../../config.js');


let storage = multer.diskStorage({
    destination: UPLOAD_PATH
});


const compareCsvFiles = ((req, res) => {
    let difference = [], result = {}, fileOne, fileTwo, fileType;

    let readFiles = new Promise((resolve, reject) => {

        let upload = multer({ storage: storage }).any();

        upload(req, res, (err) => {
            err ? reject(err) : Promise.all([splitData(req.files[0]), splitData(req.files[1])]).then((splittedArray) => {
                resolve(splittedArray);
            });

        });
    });

    let splitData = (item) => {
        return new Promise((resolve, reject) => {
            let splittedContent = [];
            if (item) {
                if (item.mimetype === 'text/csv') {
                    fileType = 'text/csv';
                    fs.readFile(item.path, (err, contents) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            splittedContent = contents.toString().split(",");
                            console.log(splittedContent);
                            resolve(splittedContent);
                        }
                    })
                }
                else if (item.mimetype === 'text/xml') {
                    fileType = 'text/xml';
                    fs.readFile(item.path, (err, contents) => {
                        splittedContent = contents.toString().split(XML_REGEX);
                        console.log(splittedContent[splittedContent.length - 1]);
                        resolve(splittedContent);
                    })
                }
                else {
                    fs.readFile(item.path, (err, contents) => {
                        if (err) throw err;
                        splittedContent = contents.toString().split(TEXTFILE_REGEX);
                        console.log(splittedContent);
                        resolve(splittedContent);
                    })
                }
            }
            else {
                reject();
            }

        })
    }

    let compareFiles = (files) => {
        return new Promise((resolve, reject) => {
            fileOne = files[0];
            fileTwo = files[1];
            if (fileOne || fileTwo) {
                _.map(fileOne, (chunk, index) => {
                    difference[index] = _.isEqual(chunk, fileTwo[index]);
                })
                resolve(difference);
            }
            else {
                reject();
            }
        })
    }

    let renderResult = () => {
        return new Promise((resolve, reject) => {
            Promise.all([hightlightDifferenceInFileOne(),
            hightlightDifferenceInFileTwo()])
                .then((highlightedContents, err) => {
                    highlightedContents ? resolve(highlightedContents) : reject(err);
                });
        });
    }

    let hightlightDifferenceInFileOne = () => {

        let fileOneContents = '', newLineOccurence = 0;

        return new Promise((resolve, reject) => {

            if (fileType === 'text/csv') {
                _.map(fileOne, (element, index) => {

                    (fileOne.length - 1) === index ? '' : element = element + ',';

                    if (difference[index]) {
                        fileOneContents = fileOneContents.concat(_.escape(element));
                    }
                    else {
                        let text = '<mark>' + _.escape(element) + '</mark>';
                        fileOneContents = fileOneContents.concat(text);
                    }

                })
            }
            else {

                fileOneContents = fileOneContents.concat('<pre>');
                _.map(fileOne, (element, index) => {

                    if (difference[index]) {
                        fileOneContents = fileOneContents.concat(_.escape(element));
                    }
                    else {
                        let text = '<mark>' + _.escape(element) + '</mark>';
                        fileOneContents = fileOneContents.concat(text);
                    }

                })
                fileOneContents = fileOneContents.concat('</pre>');
            }

            newLineOccurence = (fileOneContents.match(FIND_NEWLINE_REGEX) || []).length;
            (fileType === 'text/xml') && (newLineOccurence < 2) ? fileOneContents = _.replace(fileOneContents, /&gt;/g, '&gt;<br>') : '';
            fileOneContents ? resolve(fileOneContents) : reject(fileOneContents);

        })
    }


    let hightlightDifferenceInFileTwo = () => {

        let fileTwoContents = '', newLineOccurence = 0;;
        return new Promise((resolve, reject) => {

            if (fileType === 'text/csv') {
                _.map(fileTwo, (element, index) => {

                    (fileTwo.length) - 1 === index ? '' : element = element + ',';
                    if (difference[index]) {
                        fileTwoContents = fileTwoContents.concat(_.escape(element));
                    }
                    else {
                        let text = '<mark>' + _.escape(element) + '</mark>';
                        fileTwoContents = fileTwoContents.concat(text);
                    }
                })
            } else {

                fileTwoContents = fileTwoContents.concat('<pre>');
                _.map(fileTwo, (element, index) => {
                    if (difference[index]) {
                        fileTwoContents = fileTwoContents.concat(_.escape(element));
                    }
                    else {
                        let text = '<mark>' + _.escape(element) + '</mark>';
                        fileTwoContents = fileTwoContents.concat(text);
                    }

                })
                fileTwoContents = fileTwoContents.concat('</pre>');
            }

            newLineOccurence = (fileTwoContents.match(FIND_NEWLINE_REGEX) || []).length;
            (fileType === 'text/xml') && (newLineOccurence < 2) ? fileTwoContents = _.replace(fileTwoContents, /&gt;/g, '&gt;<br>') : '';
            fileTwoContents ? resolve(fileTwoContents) : reject(fileTwoContents);
        })
    }



    readFiles
        .then(compareFiles)
        .then(renderResult)
        .then((renderedHtmlData) => {
            result.fileOne = renderedHtmlData[0];
            result.fileTwo = renderedHtmlData[1];
            renderedHtmlData ? res.status(RESPONSE.OK).send(result) : '';
        })
        .catch((error) => {
            error ? res.status(RESPONSE.ERROR).send(error) : '';
        })
});

module.exports = {
    compareCsvFiles: compareCsvFiles
}

