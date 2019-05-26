import { getList } from './lib/letterboxd/list';
import express from 'express';
import { normalizeSlug } from './lib/letterboxd/util';
import { transformLetterboxdMovieToRadarr } from './lib/radarr/transform';

const PORT = process.env.PORT || 5000

const app = express();
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.get('/favicon.ico', (req, res) => res.status(404).send());

app.get(/(.*)/, async (req, res) => {
    const slug = normalizeSlug(req.params[0]);

    try {
        res.write('[');
        await getList(
            slug,
            () => void 0,
            movie => res.write(JSON.stringify(transformLetterboxdMovieToRadarr(movie)))
        );
        res.end(']');
    } catch(e){
        res.status(404).send();
    }
});
