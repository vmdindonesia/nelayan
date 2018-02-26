## Install Eslint (Sublime)
1. Install eslint global
```
npm install -g eslint
```

2. Install Package Control: Buka https://packagecontrol.io/installation lalu ikuti langkah-langkahnya

3. Install eslint configuration
```
npm install --save-dev eslint-config-rallycoding
```

4. Buat file `.eslintrc` di root folder. Isinya:
```
{
	"extends": "rallycoding",
	"rules": {
		"semi": 0,
		"react/require-extension": "off",
		"arrow-body-style": 0,
		"no-undef": 0,
		"no-unused-vars": 1,
		"object-curly-spacing": 0,
		"brace-style": 0,
		global-require: 0,
		"prefer-const": 0
	}
}
```

5. Install linter di sublime: klik `ctrl+shift+p` (untuk windows), pilih `Package Control: Install Package` lalu pilih `Pilih Sublimelinter`


6. Install eslint di sublime: klik `ctrl+shift+p` (untuk windows), pilih `Package Control: Install Package`lalu pilih `SublimeLinter-contrib-eslint` atau `SublimeLinter-eslint`

7. Quit sublime, lalu buka lagi. Coba kasih `;` di akhir line, pasti ada error merah2


## Install Eslint (VSCode)
1. Install eslint global
```
npm install -g eslint
```

2. Install Package / extention. Klik Di menu paling kiri, item yang paling bawah. Cari `Eslint` . lalu install dan enable

3. Install eslint configuration
```
npm install --save-dev eslint-config-rallycoding
```

4. Buat file `.eslintrc` di root folder. Isinya:
```
{
	"extends": "rallycoding",
	"rules": {
		"semi": 0,
		"react/require-extension": "off",
		"arrow-body-style": 0,
		"no-undef": 0,
		"no-unused-vars": 1,
		"object-curly-spacing": 0,
		"brace-style": 0,
		global-require: 0,
		"prefer-const": 0
	}
}
```

5.  Coba kasih `;` di akhir line, pasti ada error merah2