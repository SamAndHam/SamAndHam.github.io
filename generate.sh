#!/usr/bin/bash
# Page->Directory->Date->FilePath | Title |  Synopsis

categories=()

format_entry() {
  #$1 var name  , $2 data . $3 isLast
  isLast=$3
  var_name="\"${1%*/}\""

  if [[ $isLast == 1 ]]; then
    data="\"$2\""
  else
    data="\"$2\","
  fi

  if [[ ! -z $2 ]]; then 
    echo "$var_name:  $data"
  else
    echo "$var_name: "
  fi
}

parse_file() {
  FILE_NAME=$(echo $1 | cut --delimiter='/' --fields=4 )
  DATE=$(echo $1 | cut --delimiter='/' --fields=2 )
  TITLE=$(cat $1 | hq \#title text)
  SYNOPSIS=$(cat $1 | hq \#synopsis text)
  TAGS=$(cat $1 | hq \#tags text)

  ISLAST=$2

  echo "{"
  format_entry "Path" "$1"
  format_entry "FileName" "$FILE_NAME"
  format_entry "Date" "$DATE"
  format_entry "Title" "$TITLE"
  format_entry "Tags" "$TAGS"
  format_entry "Synopsis" "$SYNOPSIS" 1

  if [[ $2 == 0 ]]; then 
    echo "}" 
  else
    echo "},"
  fi
}

iterate_files() {
  HTMLPAGES=()
  DIR=$1
  CATEGORY=$(echo $DIR | cut --delimiter='/' --fields=1 ) 
  DATE=$(echo $DIR | cut --delimiter='/' --fields=2 )
  #echo "$CATEGORY $DATE" 
  COUNT=0
  NOF=$(ls -1 $DIR/ | wc -l)
  if [[ $NOF != 0 ]]; then
    for file in $DIR*; do
      ((COUNT++))
      PAGE_NAME=$(echo $file | cut --delimiter='/' --fields=3 )
      ISLAST=$((NOF-COUNT))
      if [[ $PAGE_NAME != "*" ]]; then
        parse_file  $file $ISLAST
      fi
    done
  fi
}

iterate_dates() {
  DIR=$1 #directory path
  dir_name=${DIR%*/}
  #echo "$dir_name $DIR"
  NUM=$(ls $DIR/ | wc -l )

  local COUNTER=0

  for date_dir in $DIR*/; do
    ((COUNTER++))

    DATE=$(echo $date_dir | cut --delimiter='/' --fields=3 )
    echo "\"$DATE\" : ["
    iterate_files $date_dir

    if (( COUNTER == NUM )); then
      echo "]"
    else
      echo "],"
    fi
  done

  #check if folder has subfolders
  #if sub folder
  
}

#iterate categories
#for each category iterate dates
#for each date_dir, get html files

echo "{"
for dir  in Categories/*/; do
  categories+=($dir)
done

count=0
for sub_dir in ${categories[@]}; do
  ((count++))
  format_entry $( echo  $sub_dir  | cut --delimiter='/' --fields=2)
  echo "{"
  iterate_dates $sub_dir

  if [[ $count == ${#categories[@]} ]]; then
    echo "}"
  else
    echo "},"
  fi

done

echo "}"
