import * as esbuild from 'esbuild'
import envFilePlugin from 'esbuild-envfile-plugin';

const esbuildOptions = {
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.cjs',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  plugins: [envFilePlugin],
}

if(process.argv.includes('-w')){
  let ctx = await esbuild.context(esbuildOptions)
  await ctx.watch()
  console.log('watching...')
}else{
  esbuild.build(esbuildOptions)
  console.log('building')
}

