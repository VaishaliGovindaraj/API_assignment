$(() => {

    const API_KEY = "6b6386d7a3f8ce3ce396cb88600dbc7a";

   
    const getDetails = async () => {
        $('.facts').text("");
        let response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=tag.getTopArtists&tag=tamil&api_key=${API_KEY}&format=json`);
        let musicData = await response.json();
        console.log(musicData);

        let musicFacts = musicData.topartists.artist;

        musicFacts.forEach(item => {
            const artistName = item.name;
            const imageUrl = "./images/Music.jpg";
            const songsUrl = item.url;

            const artistDiv = `
                <div class="artist" data-name="${artistName}" data-url="${songsUrl}">
                    <img src="${imageUrl}" alt="${artistName}">
                    <a href="${songsUrl}" target="blank">${artistName}</a>
                </div>`;
            $('.facts').append(artistDiv);
        });

        bindArtistClick();
    };

    const bindArtistClick = () => {
        $('.artist').on('click', function () {
            const name = $(this).data('name');
            const url = $(this).data('url');
            $('.artist-card .card-content').html(`
                <h2>${name}</h2>
                <a href="${url}" target="blank">More Details</a>
            `);
            $('.artist-card').fadeIn();
        });

        $('.artist-card .close').on('click', function () {
            $('.artist-card').fadeOut();
        });
    };

    const searchSongbyArtist = async () => {

        let search_input = $('#search_by_artist').val();

        try {
            let response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(search_input)}&api_key=${API_KEY}&format=json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let allArtistData = await response.json();
            console.log(allArtistData);

            $('.facts').text("");

            if (allArtistData.toptracks && allArtistData.toptracks.track) {

                let allArtistDetails = allArtistData.toptracks.track;
                console.log(allArtistDetails);

                allArtistDetails.forEach(artist => {
            
                    let artistName = artist.artist.name;
                    let songName = artist.name;
                    let playCount = artist.playcount;
                    let songURL = artist.url;

                    const artistDiv = `<div class="artist">
                        <span class="all_artist_name">${artistName}</span>
                        <div class="song_name">${songName}</div>
                        <div class="playcount">${playCount}</div>
                        <a href=${songURL} target="blank">${songName}</a>
                        <button class="fav_button">Add as Favourite</button>
                    </div>`;

                    $('.facts').append(artistDiv);

                })
            } else {
                const errorDiv = '<div class="error_description">No tracks found for the artist.</div>'
                $('.facts').append(errorDiv);
                console.error("No tracks found for the artist.");
            }

        } catch (error) {
            console.log(error);
        }

    }


    const artistName = async () => {
        let response = await fetch("http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=6b6386d7a3f8ce3ce396cb88600dbc7a&format=json");
        let artistData = response.json();
        console.log(artistData);
    }

    $('.search_album').on("click", artistName);
    $('.search_artist').on("click", getDetails);
    $(`.search_any_artist`).on("click", searchSongbyArtist);


})
