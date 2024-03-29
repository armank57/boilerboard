from rest_framework import serializers

from core.quiz2.models import Quiz2
from core.quiz2.models import Question
from core.quiz2.models import Answer
from core.quiz2.models import QuizRating

class AnswerSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Answer
        fields = [
            'text',
            'is_correct',
            'created',
            'updated',
        ]
        read_only_fields = ['question']

class QuestionSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)
    answerList = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = [
            'text',
            'answerList',
            'created',
            'updated',
        ]


class Quiz2Serializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='public_id', read_only=True, format='hex')
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)
    questionList = QuestionSerializer(many=True)

    ratings = serializers.SerializerMethodField()
    user_has_upvoted = serializers.SerializerMethodField()

    class Meta: 
        model = Quiz2
        fields = [
            'id',
            'title',
            'author',
            'questionList',
            'created',
            'updated',
            'ratings',
            'user_has_upvoted'
        ]
    def create(self, validated_data):
        questions_data = validated_data.pop('questionList')
        quiz2 = Quiz2.objects.create(**validated_data)
        for question_data in questions_data:
            answerList_data = question_data.pop('answerList')
            question = Question.objects.create(quiz2=quiz2, **question_data)
            for answer_data in answerList_data:
                Answer.objects.create(question=question, **answer_data)
        return quiz2

    def get_ratings(self, obj):
        ratings = QuizRating.objects.filter(quiz2=obj, upvote=True).count()
        return ratings
    
    def get_user_has_upvoted(self, obj):
        user = self.context['request'].user
        return QuizRating.objects.filter(user=user, quiz2=obj, upvote=True).exists()