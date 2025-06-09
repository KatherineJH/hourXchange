package com.example.oauthjwt.service.elastic;

import java.util.List;
import java.util.stream.Collectors;

import org.openkoreantext.processor.OpenKoreanTextProcessorJava;
import org.openkoreantext.processor.tokenizer.KoreanTokenizer;

import scala.collection.JavaConverters;
import scala.collection.Seq;

public class KoreanNounExtractor {

    public static List<String> extractNouns(String text) {
        CharSequence normalized = OpenKoreanTextProcessorJava.normalize(text);
        Seq<KoreanTokenizer.KoreanToken> tokens = OpenKoreanTextProcessorJava.tokenize(normalized);
        List<KoreanTokenizer.KoreanToken> tokenList = JavaConverters.seqAsJavaList(tokens);

        return tokenList.stream().filter(token -> {
            String pos = token.pos().toString();
            return pos.equals("Noun") || pos.equals("Alpha") || pos.equals("Foreign");
        }).map(token -> token.text().toString().toLowerCase()).filter(t -> !t.contains(" ")) // 단어만
                .distinct().collect(Collectors.toList());
    }
}
