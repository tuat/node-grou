var fs = require('fs'),
    path = require('path'),
    gui = require('nw.gui'),
    google = require('googleapis'),
    request = require('request'),
    cheerio = require('cheerio');

// Google account
var clientId = '',
    clientSecret = '',
    redirectURI = 'urn:ietf:wg:oauth:2.0:oob',
    OAuth2 = google.auth.OAuth2,
    oauth2Client = new OAuth2(clientId, clientSecret, redirectURI);

// Fix copy and paste
if (process.platform === "darwin") {
    var mb = new gui.Menu({type: 'menubar'});

    mb.createMacBuiltin('RoboPaint', {
        hideEdit: false,
    });

    gui.Window.get().menu = mb;
}

(function($) {

    function getUserHome() {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    }

    function downloadImageToDirectory(imageUrl) {
        var directory = $(".download-directory").val()
            file_name = imageUrl.split('/').pop();
            file_path = directory + path.sep + file_name;

        request(imageUrl + ":large").pipe(fs.createWriteStream(file_path));
    }

    function setStatus(title, message) {
        $(".status").text(title + ': ' + message);
    }

    function showResultInTextarea(pageHeader, shortenUrl) {
        $(".result-text").val([
            "Daily | BEAUTY | GIRLS",
            pageHeader,
            shortenUrl,
            "‪#‎beautiful‬ ‪#‎girls‬ ‪#‎beauty‬ ‪#‎daily‬ ‪#‎photo‬ ‪#‎tautr‬"
        ].join("\n"));

        $(".clear").prop('disabled', false);
    }

    $(document).on('click', '.auth', function() {
        console.log('Auth clicked');

        $(".access").prop('disabled', false);

        // Scope: https://developers.google.com/oauthplayground/
        var url = oauth2Client.generateAuthUrl({
            response_type: 'code',
            scope: 'https://www.googleapis.com/auth/urlshortener'
        });

        window.open(url);
    });

    $(document).on('click', '.access', function() {
        console.log('Access clicked');

        var statusTitle = 'Access token',
            authCode = $('.auth-code').val();

        if (authCode === "") {
            swal("Error!", 'Please make auth first and paste the auth code into the input box');
        }else{
            localStorage.setItem('authCode', authCode);

            setStatus(statusTitle, 'requesting');

            oauth2Client.getToken(authCode, function(err, tokens) {
                if (err) {
                    swal("Error!", err.message);
                    setStatus(statusTitle, 'error');
                }else{
                    swal("Success", 'Access token saved', 'success');
                    setStatus(statusTitle, 'success');
                    oauth2Client.setCredentials(tokens);
                    localStorage.setItem('tokens', JSON.stringify(tokens));
                    $(".generate").prop('disabled', false);
                }
            });
        }
    });

    $(document).on('click', '.generate', function() {
        console.log('Generate clicked');

        var mediaLink = $('.media-link').val(),
            downloadDirectory = $('.download-directory').val();

        if (mediaLink === "") {
            swal('Error!', 'Please provide the media link to generate');
        }else if (downloadDirectory === "") {
            swal('Error!', 'Please enter download directory');
        }else{
            var statusTitle = 'Generate Token',
                tokens = JSON.parse(localStorage.getItem('tokens'));

            oauth2Client.setCredentials(tokens);

            var urlshortener = google.urlshortener({
                version: 'v1',
                auth   : oauth2Client
            });

            setStatus(statusTitle, 'requesting');

            request(mediaLink, function(err, response, body) {
                setStatus(statusTitle, 'fetching website');

                if (err) {
                    console.log(err);
                    swal('Error!', 'Can not open the media url');
                }else{
                    var $ = cheerio.load(body);

                    var pageHeader = $(".page-header h3").clone().children().remove().end().text();
                    var imageUrl   = $("a[download]").attr('download');

                    setStatus(statusTitle, 'sending long url');

                    urlshortener.url.insert({
                        'resource': {
                            longUrl: mediaLink
                        }
                    }, function(err, response) {
                        setStatus(statusTitle, 'shortening url');

                        if (err) {
                            swal('Error!', err.message, 'error');
                            setStatus(statusTitle, 'error');
                        }else{
                            var longUrl = response.longUrl,
                                shortenUrl = response.id;

                            console.log('Long url is', longUrl);
                            console.log('Shorten url is', shortenUrl);

                            downloadImageToDirectory(imageUrl);
                            showResultInTextarea(pageHeader, shortenUrl);
                            setStatus(statusTitle, 'success');
                        }
                    });
                }
            });
        }
    });

    $(document).on('click', '.clear', function() {
        $(".media-link").val('');
        $(".result-text").val('');
    });

    $(document).on('click', '.update', function() {
        swal('Success', 'Download directory updated', 'success');

        localStorage.setItem('downloadDirectory', $(".download-directory").val());
    });

    $(function() {
        var downloadDirectory = localStorage.getItem('downloadDirectory');
        var authCode          = localStorage.getItem('authCode');

        if (downloadDirectory !== null) {
            $(".download-directory").val(downloadDirectory);
        }else{
            $(".download-directory").val(getUserHome());
        }

        if (authCode !== null) {
            $(".auth-code").val(authCode);
        }

        // Disable access, generate, clear button when auth code is not provided
        if ($(".auth-code").val() === "") {
            $(".access").prop('disabled', true);
            $(".generate").prop('disabled', true);
            $(".clear").prop('disabled', true);
        }
    })

})(jQuery);
