<?xml version="1.0"?>
<ruleset name="Pivotal Agency">
    <description>Pivotal Wordpress Coding Standards</description>

    <!-- Scan all files in directory -->
    <file>.</file>

    <!-- Scan only PHP files -->
    <arg name="extensions" value="php"/>

    <!-- Show colors in console -->
    <arg value="-colors"/>

    <!-- Show sniff codes in all reports -->
    <arg value="ns"/>

    <!-- Include the WordPress-Extra standard. -->
    <rule ref="WordPress-Extra">
        <!-- Exclude any rules here -->
        <exclude name="WordPress.PHP.DisallowShortTernary"/>
    </rule>

    <!-- Let's also check that everything is properly documented. -->
    <rule ref="WordPress-Docs"/>

    <!-- Add in some extra rules from other standards. -->
    <rule ref="Generic.CodeAnalysis.UnusedFunctionParameter"/>
    <rule ref="Generic.Commenting.Todo"/>

    <config name="minimum_supported_wp_version" value="5.1"/>
</ruleset>