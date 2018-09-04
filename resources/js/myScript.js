function validate_form(form_object) {
    // formstatus holder styr på om der opstår fejl
    // sæt bekræftelsesmedelelse i confirm_msg
        var formstatus = 1; 
        var confirm_msg = "Bekræft at du vil sende følgende oplysninger:" + "\n\n"; 
        console.dir (form_object);
    // Find de felter, der skal være udfyldt i formularen og gem i array: input_req til indeksering
        var input_req = form_object.querySelectorAll(":required"); 
     
    //Looper input elementerne og tjekker at value attributten er udfyldt og forskellig fra blank
         for(var i = 0; i < input_req.length; i++) {
            
        //Henter tekst node fra inputfeltets label tag
            var labeltext = input_req[i].previousElementSibling.textContent;
           
            //Sæt fejl via handle_error hvis værdien er tom eller hvis den er blank
            if(!input_req[i].value || input_req[i].value === " ") {
                handle_error(input_req[i], "Du skal udfylde feltet " + labeltext.toLocaleLowerCase() + "!"); 
                formstatus = 0;
            }
            else {
            
                if(formstatus === 1) {
                    var inpval = input_req[i].value; 
                    confirm_msg += labeltext + ": " + inpval + "\n";
                };
                
                // console.dir (confirm_msg); 
            }
        }
    
        // Required-felter har et indhold. Nu skal formattet i alle formularens felter valideres, hvis der ikke er fundet fejl.
        if (formstatus === 0) {
            return false; 
        }
    
        for(var i = 0; i < form_object.length; i++) {
    
            var field_stat = 1; 
            if(form_object[i].hasAttribute("data-name")) {
                var field_stat = validate_dataName (form_object[i]);
            };
            
    
            if(form_object[i].hasAttribute("data-email")) {
                var field_stat = validate_dataEmail (form_object[i]);
            };
           
    
            if(form_object[i].hasAttribute("data-tel")) {
                var field_stat = validate_dataTel (form_object[i]);
            };
            
            
            if(form_object[i].hasAttribute("data-all")) {
                var field_stat = 1; 
            };
    
            if (field_stat === 0) {
                formstatus = field_stat; 
            }
        
            console.dir ("formstatus: " + formstatus); 
        }
    
        // Speciel validering for checkbox, fordi den består af flere felter. De skal valideres som en blok pr checkbox-gruppe. Så koden bliver skrevet for hver gruppe af en checkbox i formularen. 
    
        // Valider at der er mindst 1 markering i en checkbox (samme class "acceptpriv" til alle elementer i en gruppe)
    
        window.privCheck = 0; 
        window.elemPriv = null;
        form_object.querySelectorAll(".acceptpriv").forEach( function(element) {
         // Undersøg checkbox med class=acceptpriv
             
           if(element.type == "checkbox") { 
            // Gem element til positionering af fejl
                window.elemPriv = element; 
                // Fjern evt. tidligere fejl
                element.addEventListener("click", function() {
                    if(element.nextElementSibling.classList.contains("text-error")) {
                        //Fjern input objektets næste sibling (fejlmeddelelse)
                        element.nextElementSibling.remove();
                        //Nulstil baggrund til auto på input objektet
                        element.style = "background: auto";
                        //Fjern klassen field-error fra input objektet
                        element.classList.remove("field-error");
                    }
                });
            
                console.dir ("a ");
                console.dir (window.elemPriv);
                if(element.checked == true) {
                    window.privCheck = 1; 
                }
                console.dir ("pc " + window.privCheck);   
            }
            
        });
       
        // Fejl når checkbox markering mangler 
        if(window.privCheck == 0 && window.elemPriv != null) {
            console.dir ("fejl check");
            handle_error(window.elemPriv, "Du skal markere mindst een checkbox");
            // window.privCheck = null; 
            // window.elemPriv = null;
            return false;   
        }
        console.dir ("b ");
        console.dir (window.elemPriv);
        
        
        if (formstatus == 1) {
            //Bekræft afsendelse med confirm og confirm_message
            // console.dir ("send confirm"); 
            if(confirm(confirm_msg)) {
                //Redirect til en landingpage
                // location.href = 'confirmpage.html';
                //eller submit form
                //form_object.submit();
            
            }
        else {
            return false;
        }
           
    }
    
    } 
    
    // Valider navnefelter 
    function validate_dataName (input_object) {
    // Opsæt variabel med valide tegn i et navn 
        // - valide specialtegn: . - ' " " 
        var regex = /[a-z]|[A-Z]|\æ|\ø|\å|\Æ|\Ø|\Å|\.|\-|\'|\s/;
    
        for(let i = 0; i < input_object.value.length; i++) {
            var chk = input_object.value.substr(i,1); 
            if(!regex.test(chk) === true) {
                handle_error(input_object, "Du har angivet en forkert værdi i dit navn " + chk);
                return 0;  
            }
        }
        
        // Ingen fejl i navn 
        return 1; 
    }
    // Slut valider navne-felter 
    
    // Valider Email-adresser 
    function validate_dataEmail (input_object) {
    // Opsæt variabel med valide tegn i en email-adresse
    
        // - valide specialtegn: ! # $ % & ‘ * + – / = ? ^ _ ` . { | } ~
        var regex = /[a-z]|[A-Z]|[0-9]|\æ|\ø|\å|\Æ|\Ø|\Å|\s|\.|\+|\-|\*|\/|\!|\#|\$|\%|\&|\‘|\=|\?|\^|\_|\`|\{|\||\}|\~|\@/;
        for(let i = 0; i < input_object.value.length; i++) {
            var chk = input_object.value.substr(i,1); 
            if(!regex.test(chk) === true) {
                handle_error(input_object, "Du har angivet en forkert værdi i din E-mail adresse: " + chk);
                return 0;  
            }
        }
    
        // Kontroller @ 
        var adpos = input_object.value.indexOf("@"); 
        if (adpos < 1) {
            handle_error(input_object, "Din E-mail skal indeholde @ efterfulgt af et ., for eksempel dig@firma.dk");
            return 0;  
        } 
    
        // Kontroller at der er . efter @
        var ppos = input_object.value.indexOf(".",adpos+1);
        if (ppos <= 0) {
            handle_error(input_object, "Din E-mail skal indeholde et . efter @ som i dig@firma.dk");
            return 0; 
        }
    
        // Kontroller at der er indhold mellem @ og .
        if(adpos+1 === ppos) {
            handle_error(input_object, "Din E-mail skal indeholde et tegn mellem @ og . som i dig@firma.dk");
            return 0;   
        }
    
        // Kontroller at email kun indeholder een forekomst af @
        var adpos1 = input_object.value.indexOf("@",adpos+1); 
        if (adpos1 > 0) {
            handle_error(input_object, "Din E-mail må kun indeholde een @ som i dig@firma.dk");
            return 0;  
        }
     
        // Kontroller at email har indhold efter sidste . (domænenavn)
        var lppos = input_object.value.lastIndexOf(".");
        var i_lgd = input_object.value.length;
    
        if (i_lgd <= lppos+1) {
            handle_error(input_object, "Din E-mail skal indeholde et domæne-navn efter sidste . som i dig@firma.dk");
            return 0;  
        }
           
        // Ingen fejl i E-mail 
        return 1;  
    } 
    // Slut valider Email-adresser 
    
    // Valider telefonnummer
    function validate_dataTel (input_object) {
     // Opsæt variabel med valide tegn i et telefonnummer 
            
        // - valide specialtegn: " " + 
        var regex = /[0-9]|\s|\+/;
        for(let i = 0; i < input_object.value.length; i++) {
            var chk = input_object.value.substr(i,1); 
            if(!regex.test(chk) === true) {
                handle_error(input_object, "Du har angivet en forkert værdi i dit telefonnr: " + chk);
                return 0;  
            }
        }
        
        // Ingen fejl i telefonnummer 
        return 1; 
    } 
    // Slut valider telefonnummer 
    
    // Valider felter f.eks meddelelser uden krav til indhold 
    function validate_dataAll (input_object) {
        return 1; 
    }
    // Slut valider meddelelse
    
    // Håndter fejl og giv besked 
    
    function handle_error(input_object, input_msg) {
    
        if(!input_object.nextElementSibling)  { 
            //Indsætter tilstødende html med fejlbesked efter input feltet
            input_object.insertAdjacentHTML('afterend','<div class="text-error">' + input_msg + '</div>');
    
            //Eksempel på direkte DOM manipulation med styles
            input_object.style = "background: #ff0";
    
            //Eksempel på direkte DOM manipulation med tilføjelse af klasse
            input_object.classList.add("field-error");
    
            input_object.onkeypress = function() { 
                console.dir ("keyP: " + input_object + " " + input_msg);
    
            // Tjek om fejl er vist i tidlige validering - altså om næste sibling har klassen text-error, som er sat i et tidligere gennemløb 
                if(input_object.nextElementSibling.classList.contains("text-error")) {
                    //Fjern input objektets næste sibling (fejlmeddelelse)
                input_object.nextElementSibling.remove();
                    //Nulstil baggrund til auto på input objektet
                input_object.style = "background: auto";
                    //Fjern klassen field-error fra input objektet
                input_object.classList.remove("field-error");
            } 
        }
    }
        
    
    }  
// Find det aktive element i menuen
// Get the container element
var btnContainer = document.getElementById("navMenu");

// Get all buttons with class="btn" inside the container
var btns = btnContainer.getElementsByClassName("btn");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
    
    
        