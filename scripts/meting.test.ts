import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchMeting, parseMusicUrl, resolvePlaylist } from '../src/lib/meting';

test('provided playlist link resolves its ID and ignores sharing parameters', () => {
  assert.deepEqual(parseMusicUrl('https://music.163.com/playlist?id=824962536&uct2=share'), {
    server: 'netease',
    type: 'playlist',
    id: '824962536',
  });
});

test('HTTPS playlists also use HTTPS for provider audio, covers and lyrics', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify([
        {
          name: '月华舞',
          artist: '洛天依',
          url: 'http://163.hyc.moe?type=url&id=1',
          pic: 'http://163.hyc.moe?type=pic&id=1',
          lrc: 'http://163.hyc.moe?type=lrc&id=1',
        },
      ]),
    );
  const [song] = await fetchMeting('netease', 'playlist', '824962536');
  for (const value of [song.url, song.pic, song.lrc]) assert.equal(new URL(value).protocol, 'https:');
});

test('total provider failure reaches the player retry UI', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () => new Response('', { status: 503 });
  await assert.rejects(resolvePlaylist(['https://music.163.com/playlist?id=824962536']), /503/);
});

test('one unavailable playlist does not hide another working playlist', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async (input) =>
    new URL(String(input)).searchParams.get('id') === '1'
      ? new Response('', { status: 503 })
      : new Response(JSON.stringify([{ name: '可播放歌曲', artist: '歌手', url: 'https://example.com/audio.mp3' }]));
  const songs = await resolvePlaylist(['https://music.163.com/playlist?id=1', 'https://music.163.com/playlist?id=2']);
  assert.equal(songs.length, 1);
  assert.equal(songs[0].name, '可播放歌曲');
});
