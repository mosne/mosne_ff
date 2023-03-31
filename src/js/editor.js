import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'

import lazySizes from 'lazysizes'

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}

// Native Gutenberg
if (typeof wp !== 'undefined') {
  wp.domReady(() => {
    wp.blocks.unregisterBlockStyle('core/separator', ['wide', 'dots'])
    // whitelist core embeds
    const allowedEmbedVariants = ['youtube', 'vimeo', 'dailymotion']
    wp.blocks.getBlockVariations('core/embed').forEach((variant) => {
      if (!allowedEmbedVariants.includes(variant.name)) {
        wp.blocks.unregisterBlockVariation('core/embed', variant.name)
      }
    })
  })
}

// ACF Blocks
if (window.acf) {
  // Do stuff
}

wp.hooks.addFilter('blocks.registerBlockType', 'mosne', function (settings, name) {
  if (name === 'core/paragraph') {
    // compact preview for block paragraph
    settings.example.attributes.dropCap = false
  }

  if (name === 'core/separator' || name === 'core/quote' || name === 'core/pullquote' || name === 'core/table') {
    // remove custom styles
    settings.styles = []
  }

  if (name === 'core/image') {
    // remove custom styles
    settings.styles = []
    // set default aligment for images to null
    settings.attributes.align = {
      type: 'string',
    }
  }

  return settings
})
