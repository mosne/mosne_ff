<?php

function includeWithVariables( $filePath, $variables = array(), $print = true ) {
	// allow unique variable as string
	if ( gettype( $variables ) === 'string' ) {
		$variables = array( 'variable' => $variables );
	}

	$output = null;
	if ( file_exists( $filePath ) ) {
		// Extract the variables to a local namespace
		extract( $variables );

		// Start output buffering
		ob_start();

		// Include the template file
		include $filePath;

		// End buffering and return its contents
		$output = ob_get_clean();
	}
	if ( $print ) {
		print $output;
	}
	return $output;
}

// shortcut for including partials/ files
function get_template_part( $file, $variables = array(), $print = true ) {
	return includeWithVariables( $file . '.php', $variables, $print );
}

// random lorem size of lorem ipsum
function get_lorem( $min, $max ) {
	$lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio quibusdam ipsam maiores? Consectetur, corrupti vitae cumque atque vero tempore nostrum temporibus in illo similique error. Vitae non accusamus quo maiores soluta aliquid totam voluptatem dignissimos, mollitia explicabo, illum quam natus, consectetur eveniet debitis cupiditate sint labore tempora veniam consequatur rerum ex quod nihil. Animi esse numquam mollitia ullam. Inventore facere voluptatem nisi consectetur ipsum suscipit similique vero. Amet exercitationem earum, quae soluta aliquam assumenda enim dicta, inventore modi rem maxime sequi sit, dolores quod mollitia est accusantium. Cupiditate officia laudantium et qui maxime tempora quibusdam tempore sunt, excepturi sapiente voluptatem distinctio non nulla expedita similique necessitatibus fugit pariatur aut odio consequuntur quasi asperiores, illum labore beatae! Optio corporis iusto neque odit perspiciatis consequatur, laudantium tempore odio, vitae nostrum magni sed eos officiis dolor hic aut vel accusamus esse repellat dolores, alias deleniti blanditiis quisquam. Cumque a sunt quia. Odit ea tenetur culpa quo quod ratione praesentium dolore ipsa quae cumque debitis aliquam distinctio magni unde, doloremque velit veritatis iste temporibus! Rerum nobis libero recusandae mollitia, rem quibusdam reiciendis sapiente, voluptates exercitationem iste dolorem odit repellendus fuga dolore aliquid laudantium. Quidem repellendus culpa sed cumque beatae voluptatum ipsam aliquam explicabo magni magnam ut vero accusantium rem, aliquid at harum id. Illo, eos! Distinctio cupiditate, voluptates cum facilis dignissimos unde placeat nemo a inventore quas atque optio, soluta ea fuga omnis! Ullam consequatur quam dolores tempore, totam quidem laboriosam expedita blanditiis ipsam ut obcaecati. Quaerat velit vero fugiat amet cupiditate? Similique quisquam unde itaque totam quas vel magni, nisi asperiores rerum consectetur eum, ratione doloremque, optio aliquid. Ullam distinctio deserunt sapiente veritatis, saepe molestiae reprehenderit culpa nesciunt neque facilis itaque voluptatum dignissimos deleniti iste ad? Sequi ab consequuntur facere, omnis harum porro corporis at nesciunt, quaerat iusto impedit animi dolorem error, excepturi dolores nemo magnam ea modi a? Delectus possimus quibusdam beatae natus, dolore ipsam voluptas blanditiis officiis quod doloremque eligendi, nobis quia nemo deserunt a doloribus vitae dolor necessitatibus velit iusto voluptatum esse reiciendis dolorem similique. Aliquam provident totam, laborum hic temporibus blanditiis exercitationem nobis quam molestiae quidem excepturi ipsum cum. Ad optio sequi iste assumenda minus eveniet dolor nobis autem exercitationem magnam qui harum architecto mollitia nostrum aliquid, omnis necessitatibus ipsa! Autem iusto blanditiis, totam eum id saepe aliquid sequi. Earum, ea provident. Id, cupiditate molestiae! Quos ullam quis iste neque soluta deserunt aut perspiciatis laudantium, eum qui! Possimus, quaerat. Explicabo quam temporibus minima, ducimus totam ab dolore ea accusamus reprehenderit rem! Nihil, iure corporis ut quibusdam quos dolorum cupiditate porro maiores hic vel. Dolorum cum quidem dicta laboriosam minima unde dignissimos veniam impedit ad odit. Inventore, beatae officiis odit doloribus accusamus nemo perferendis ipsam laudantium officia commodi doloremque molestiae iste labore tempora magnam voluptates aliquam odio saepe. Porro, dignissimos culpa. Eligendi, corrupti nobis sit maxime, mollitia et eos eius ut unde quis ducimus, reprehenderit quia iste repellat nam dolore harum sint. Ducimus accusamus, sit repellat autem quae eaque aliquam numquam consequatur, placeat, incidunt itaque facilis atque enim harum delectus.';

	$min = max( $min, 0 );
	$max = min( $max, strlen( $lorem ) - 1 );

	echo substr( $lorem, 0, rand( $min, $max ) );
}

function m_icon( $fileName, $print = true ) {

	$output = '<svg class="icon icon-' . $fileName . '" aria-hidden="true" role="img"><use xlink:href="/dist/icons.svg#icon-' . $fileName . '"></use></svg>';
	if ( $print ) {
		print $output;
	}
	return $output;
}

function m_image( $w, $h, $alt = 'Image placeholder', $print = true ) {

	$ratio  = 100 * bcdiv( $h, $w, 5 );
	$srcset = 'https://via.placeholder.com/' . $w . 'x' . $h . ' ' . $w . 'w, ' . 'https://via.placeholder.com/' . bcdiv( $w, 2, 0 ) . 'x' . $h / 2 . ' ' . bcdiv( $w, 2, 0 ) . 'w';
	$output = '<div class="m-img-wrap" style="padding-bottom:' . $ratio . '%">
	<img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=" data-sizes="auto" data-srcset="' . $srcset . '" alt="' . $alt . '">
	</div>';

	if ( $print ) {
		print $output;
	}
	return $output;
}

?>
<!doctype html>
<html lang="en-US" class="no-js" data-whatintent data-whatinput>
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<title><?php echo $pageTitle; ?></title>
	<meta name="robots" content="noindex, follow" />
	<link rel='dns-prefetch' href='//ajax.googleapis.com' />
	<link rel='dns-prefetch' href='//fonts.googleapis.com' />
	<link rel='dns-prefetch' href='//s.w.org' />
	<link rel='stylesheet' id='custom_fonts-css'  href='/assets/fonts/fonts.css' media='all' />
	<link rel='stylesheet' id='mosne_style-css'  href='/dist/app.css' media='all' />
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<meta name="theme-color" content="#ffffff">
</head>
<body class="<?php echo $bodyClass; ?>">
