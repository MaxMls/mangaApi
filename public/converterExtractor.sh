#!/bin/bash

# преобразует архивы и pdf в папки с файлами
echo "finding pdf's...";

find -name '*.pdf' -print0 | while read -d $'\0' i
do
    echo "$i"
	y=${i%.*};
	mkdir -p "$y"; 
    if convert "$i" "$y"/img.jpg; then
         rm "$i";
    else
        rmdir "$y";
    fi
done

echo "finding rar's...";

find -name '*.rar' -or -name '*.cbr' -print0 | while read -d $'\0' archive
do
    echo "$archive"
    destination="${archive%.*}"
    mkdir -p "$destination"; 

    if unrar e "$archive" "$destination"; then
        rm "$archive";
    else
        rmdir "$destination";
    fi
done

echo "finding zip's...";

find -name '*.zip' -print0 | while read -d $'\0' archive
do
    echo "$archive"
    destination="${archive%.*}"
    mkdir -p "$destination";

    if unzip "$archive" -d "$destination"; then
        rm "$archive";
    else
        rmdir "$destination";
    fi
done



# jpg jpeg gif png apng 
# открывать папку пока не попадется картинка, родитель картинки - имя главы, но если картинки в корневой папке, то имя главы = 0
# 
# все главы сортируются по строке имени, по возрастанию
# имя корневой папки - название произведения

echo "starting create db...";
echo "converting image's...";

db="../db"
mkdir -p "$db";


dbcreate () 
{ 
    img=$1;

    dir=$(dirname "$img");
    name=$(basename "$img");
    chapter=${dir##*/}
    extension="${img##*.}"

    base=$(echo "$dir" | cut -d "/" -f 3)
    category=$(echo "$dir" | cut -d "/" -f 2)


   # echo "---------------";
   # echo "$chapter";
   # echo "$name";
   # echo "$extension";
    #echo "$base";
    #echo "$category";


    if [[ "$base" == "$chapter" ]]; then
        chapter="0";
    fi

    finDir="./$db/$category/$base/$chapter";
    finFile="$finDir/${name%.*}.jpg"


    if [[ ! -d "$finDir" ]]; then
        mkdir -p "$finDir";
    fi

    if [[ ! -f "$finFile" ]]; then
        if [[ $extension == "jpg" ]] || [[ $extension == "jpeg" ]]; then
            mv "$img" "$finFile";
        else
            convert "$img" "$finFile";
        fi
    fi

    
    # echo "$img";
    # echo "$finDir/$name"

    # rmdir "$finDir";
}

find -type f \( -iname  \*.jpg -o -iname \*.jpeg  -o -iname \*.gif  -o -iname \*.png \) -print0 | while read -d $'\0' img
do
    dbcreate "$img" &
done

wait
echo "end"