const apiExample = document.getElementById('api-example');
const apiResponse = document.getElementById('api-response');

let exampleCode, exampleResponse;
let apiCode = {
    codeType: '',
    codeParam: '',
    codeBranch: '',
    codeOptions: {},
    codeService: ''
};

const setActiveButton = (targetButtonId,buttonType) => {
    const buttonList = document.getElementsByClassName(`${buttonType}__button`);
    const buttonExtraList = document.getElementById(`${targetButtonId}-endpoints-list`);

    for(let index = 0; index < buttonList.length; index ++){
        let currentButton = buttonList[index];

        if(document.getElementById(`${currentButton.id}-endpoints-list`) !== null && buttonExtraList !== null){
            document.getElementById(`${currentButton.id}-endpoints-list`).style.display = 'none';
        }

        currentButton.classList.remove('--active');
    };

    if(buttonExtraList !== null){
        buttonExtraList.style.display = 'flex';
    }

    const currentButton = document.getElementById(targetButtonId) ;

    currentButton.classList.add('--active');

    for(let index = 0; index < buttonList.length; index ++){
        let currentElement = buttonList[index];

        if(currentButton.parentElement.id !== `${currentElement.id.split('-')[0]}-endpoints-list`){
            if(currentElement.id !== currentButton.id && document.getElementById(`${currentElement.id}-endpoints-list`)){
                document.getElementById(`${currentElement.id}-endpoints-list`).style.display = 'none'
            }
        }
    };

    exampleResponse = `
{}`;
    apiResponse.textContent = exampleResponse;
    Prism.highlightElement(apiResponse);
};

const getAPI = () => {
    fetch(`/${apiCode.codeService}/api/${apiCode.codeBranch}/${apiCode.codeType}${apiCode.codeParam}`,apiCode.codeOptions)
    .then(response => {
        return response.json();
    })
    .then(data => {
        exampleResponse = '\n' + JSON.stringify(data, null, '   ');

        apiResponse.textContent = exampleResponse;
        Prism.highlightElement(apiResponse);
    });
};

const setAPICode = ({codeBranch,codeType,codeParam}) => {
    codeParam = codeParam === null || codeParam === undefined ? '' : '?' + codeParam;
    codeBranch = codeBranch === null || codeBranch === undefined ? 'v1' : codeBranch;
    
    const splittedCodeType = codeType.split('-')[0];

    apiCode.codeService = codeType === 'projects' ? 'efrederick' : 'namah';

    if(splittedCodeType === 'auth'){
        const myHeaders = new Headers(); 
        myHeaders.append("Content-Type", "application/json"); 

        apiCode.codeType = splittedCodeType;
        apiCode.codeOptions = {
            headers: myHeaders,
            method: "'POST'",
            body: {
                email: "'namahcast@big-bang-web.br'",
                password: "'123456'"
            }
        };
    }else{
        apiCode.codeType = splittedCodeType;
        apiCode.codeOptions = {method: "'GET'"};
    }

    apiCode.codeBranch = codeBranch;
    apiCode.codeParam = codeParam === '' ? codeParam : encodeURI(codeParam);

exampleCode =`
fetch('https://api.efrederick.dev/${apiCode.codeService}/api/${apiCode.codeBranch}/${apiCode.codeType}${apiCode.codeParam}',${JSON.stringify(apiCode.codeOptions, null, '    ').replace(/[^\w\s:@.'-{}]/gi, '')})
.then(response => {
    return response.json();
})
.then(data => {
    console.log(data);
})`;
    if(apiCode.codeOptions.body !== null && apiCode.codeOptions.body !== undefined){
        apiCode.codeOptions.body = JSON.stringify(apiCode.codeOptions.body).replace(/[']/g, "");
    };
    apiCode.codeOptions.method = apiCode.codeOptions.method.replace(/[']/g, "");

    apiExample.textContent = exampleCode;

    setActiveButton(codeType, 'api');
    Prism.highlightElement(apiExample);
};

const generateCodeBlock = (targetService) => {
    const allButtonsList = document.getElementsByClassName('api__buttons');

    for(let index = 0; index < allButtonsList.length; index ++) {
        const currentButton = allButtonsList[index];

        if(currentButton.id === `${targetService}-service-list`){
            currentButton.style.display = 'grid';
        }else{
            currentButton.style.display = 'none';
        }
    }

    const endpointList = document.getElementsByClassName(`api__endpoints`);
    
    for(let index = 0; index < endpointList.length; index ++){
        let currentButton = endpointList[index];

        if(currentButton.id === `${targetService}-endpoint-list`){
            currentButton.style.display = 'grid';
        }else{
            currentButton.style.display = 'none';
        }
    };

    switch (targetService) {
        case 'efrederick':
            setAPICode({
                codeBranch: 'v1',
                codeType:'projects'
            });
            break;
        case 'namah':
            setAPICode({
                codeBranch: 'v1',
                codeType:'auth'
            });
            break;
        default:
            return;
    }

    const buttonList = document.getElementsByClassName(`service__button`);

    for(let index = 0; index < buttonList.length; index ++){
        let currentButton = buttonList[index];

        currentButton.classList.remove('--active');
    };

    document.getElementById(`${targetService}-service`).classList.add('--active');
};

generateCodeBlock('efrederick');