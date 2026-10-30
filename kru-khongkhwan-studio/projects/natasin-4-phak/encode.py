import json, subprocess
T = json.load(open('timeline.json')); clips = [s for s in T['segs'] if s['kind'] == 'clip']; end = T['segs'][-1]
args = ['ffmpeg', '-v', 'error', '-y', '-framerate', '24', '-i', 'out/frames/f%05d.jpg']
for s in clips: args += ['-t', str(s['dur'] + .1), '-i', f"{s['name']}.mov"]
args += ['-loop', '1', '-framerate', '24', '-i', 'site/img/logo_round.png', '-i', 'out/mix.wav']
f, last = [], '0:v'
for i, s in enumerate(clips, 1):
    p, d = s['play'], s['dur']
    f.append(f"[{i}:v]crop=2732:1536:0:256,scale=1000:562:flags=lanczos,fps=24,format=yuva420p,fade=t=in:st=0:d=0.3:alpha=1,fade=t=out:st={d-0.45:.3f}:d=0.45:alpha=1,trim=0:{d:.3f},setpts=PTS-STARTPTS+{p:.3f}/TB[c{i}]")
    f.append(f"[{last}][c{i}]overlay=40:620:eof_action=pass:enable='between(t,{p:.3f},{p+d:.3f})'[v{i}]"); last = f'v{i}'
L = len(clips) + 1
f.append(f"[{L}:v]scale=84:84,format=rgba,colorchannelmixer=aa=0.42[wm]")
f.append(f"[{last}][wm]overlay=34:40:shortest=1:enable='lt(t,{end['v0']:.3f})',format=yuv420p[out]")
args += ['-filter_complex', ';'.join(f), '-map', '[out]', '-map', f'{L+1}:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
         '-pix_fmt', 'yuv420p', '-r', '24', '-c:a', 'aac', '-b:a', '192k', '-t', str(T['total']), '-movflags', '+faststart', 'out/nattasin_4phak_v3.mp4']
subprocess.run(args, check=True)
